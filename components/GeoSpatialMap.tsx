'use client';

import { Property } from '@/lib/types';
import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, Layers, Filter, Building2, Globe } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface GeoSpatialMapProps {
  properties: Property[];
}

type MapView = 'heat' | 'bubble';
type PriceRange = 'all' | 'economy' | 'entry' | 'mid-market' | 'premium' | 'luxury';
type AggregationLevel = 'state' | 'city' | 'neighborhood' | 'zip' | 'address';

interface PriceSegment {
  label: string;
  min: number;
  max: number;
  color: string;
}

interface GeographicAggregate {
  key: string;
  label: string;
  latitude: number;
  longitude: number;
  propertyCount: number;
  avgAccessRate: number;
  totalAccessCount: number; // Sum of occupancy rates (as access counts)
  avgPrice: number;
  totalValue: number;
  avgROI: number;
  properties: Property[];
}

const priceSegments: PriceSegment[] = [
  { label: 'Economy', min: 0, max: 200000, color: '#3b82f6' },
  { label: 'Entry', min: 200000, max: 400000, color: '#10b981' },
  { label: 'Mid-Market', min: 400000, max: 600000, color: '#f59e0b' },
  { label: 'Premium', min: 600000, max: 800000, color: '#ef4444' },
  { label: 'Luxury', min: 800000, max: Infinity, color: '#8b5cf6' },
];

const aggregationLevels: { value: AggregationLevel; label: string; description: string }[] = [
  { value: 'state', label: 'State', description: 'Aggregate by state' },
  { value: 'city', label: 'City/Town', description: 'Aggregate by city' },
  { value: 'neighborhood', label: 'Neighborhood', description: 'Cluster by proximity (~5km)' },
  { value: 'zip', label: 'ZIP Code', description: 'Aggregate by ZIP code' },
  { value: 'address', label: 'Individual Address', description: 'Show each property' },
];

// Component to fit map bounds to markers
function MapBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
}

// Simple clustering algorithm for neighborhoods
function clusterByProximity(properties: Property[], maxDistance: number = 0.05): Map<string, Property[]> {
  const clusters = new Map<string, Property[]>();
  const assigned = new Set<string>();

  properties.forEach((property, index) => {
    if (assigned.has(property.id)) return;

    const cluster: Property[] = [property];
    assigned.add(property.id);

    // Find nearby properties
    properties.forEach((other, otherIndex) => {
      if (otherIndex <= index || assigned.has(other.id)) return;

      const distance = Math.sqrt(
        Math.pow(property.latitude - other.latitude, 2) +
        Math.pow(property.longitude - other.longitude, 2)
      );

      if (distance < maxDistance) {
        cluster.push(other);
        assigned.add(other.id);
      }
    });

    // Use first property's coordinates as cluster center
    const clusterKey = `neighborhood-${property.latitude.toFixed(4)}-${property.longitude.toFixed(4)}`;
    clusters.set(clusterKey, cluster);
  });

  return clusters;
}

export default function GeoSpatialMap({ properties }: GeoSpatialMapProps) {
  const [mapView, setMapView] = useState<MapView>('bubble');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('all');
  const [aggregationLevel, setAggregationLevel] = useState<AggregationLevel>('city');
  const [hoveredArea, setHoveredArea] = useState<GeographicAggregate | null>(null);

  const filteredProperties = useMemo(() => {
    if (selectedPriceRange === 'all') return properties;
    const segment = priceSegments.find(s => s.label.toLowerCase().replace('-', '') === selectedPriceRange);
    if (!segment) return properties;
    return properties.filter(
      p => p.currentValue >= segment.min && p.currentValue < segment.max
    );
  }, [properties, selectedPriceRange]);

  // Aggregate properties by geographic area
  const geographicData = useMemo(() => {
    // For individual addresses, create a single-property aggregate for each
    if (aggregationLevel === 'address') {
      return filteredProperties.map(property => ({
        key: property.id,
        label: `${property.address}, ${property.city}, ${property.state}`,
        latitude: property.latitude,
        longitude: property.longitude,
        propertyCount: 1,
        avgAccessRate: property.occupancyRate,
        totalAccessCount: property.occupancyRate,
        avgPrice: property.currentValue,
        totalValue: property.currentValue,
        avgROI: property.roi,
        properties: [property],
      } as GeographicAggregate));
    }

    const aggregates = new Map<string, {
      properties: Property[];
      totalLat: number;
      totalLng: number;
    }>();

    if (aggregationLevel === 'neighborhood') {
      // Use clustering for neighborhoods
      const clusters = clusterByProximity(filteredProperties, 0.05);
      
      clusters.forEach((clusterProperties, clusterKey) => {
        const totalLat = clusterProperties.reduce((sum, p) => sum + p.latitude, 0);
        const totalLng = clusterProperties.reduce((sum, p) => sum + p.longitude, 0);
        aggregates.set(clusterKey, {
          properties: clusterProperties,
          totalLat,
          totalLng,
        });
      });
    } else {
      // Standard aggregation by geographic key
      filteredProperties.forEach(property => {
        let key: string;
        switch (aggregationLevel) {
          case 'state':
            key = property.state;
            break;
          case 'city':
            key = `${property.city}, ${property.state}`;
            break;
          case 'zip':
            key = property.zipCode;
            break;
          default:
            key = property.id;
        }

        const existing = aggregates.get(key) || {
          properties: [],
          totalLat: 0,
          totalLng: 0,
        };

        existing.properties.push(property);
        existing.totalLat += property.latitude;
        existing.totalLng += property.longitude;
        aggregates.set(key, existing);
      });
    }

    return Array.from(aggregates.entries()).map(([key, data]) => {
      const count = data.properties.length;
      const avgLat = data.totalLat / count;
      const avgLng = data.totalLng / count;

      // Calculate access counts (sum of occupancy rates) and average access rate
      const totalAccessCount = data.properties.reduce((sum, p) => sum + p.occupancyRate, 0);
      const avgAccessRate = totalAccessCount / count;

      const avgPrice = data.properties.reduce((sum, p) => sum + p.currentValue, 0) / count;
      const totalValue = data.properties.reduce((sum, p) => sum + p.currentValue, 0);
      const avgROI = data.properties.reduce((sum, p) => sum + p.roi, 0) / count;

      let label: string;
      switch (aggregationLevel) {
        case 'state':
          label = key;
          break;
        case 'city':
          label = key;
          break;
        case 'neighborhood':
          // Use the city of the first property in the cluster
          const firstCity = data.properties[0].city;
          const firstState = data.properties[0].state;
          label = `Neighborhood (${firstCity}, ${firstState})`;
          break;
        case 'zip':
          label = `ZIP ${key}`;
          break;
        default:
          label = key;
      }

      return {
        key,
        label,
        latitude: avgLat,
        longitude: avgLng,
        propertyCount: count,
        avgAccessRate,
        totalAccessCount,
        avgPrice,
        totalValue,
        avgROI,
        properties: data.properties,
      } as GeographicAggregate;
    }).sort((a, b) => b.propertyCount - a.propertyCount);
  }, [filteredProperties, aggregationLevel]);

  const mapBounds = useMemo(() => {
    if (geographicData.length === 0) return [[37.7749, -122.4194], [37.7749, -122.4194]] as L.LatLngBoundsExpression;

    const lats = geographicData.map(d => d.latitude);
    const lngs = geographicData.map(d => d.longitude);

    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ] as L.LatLngBoundsExpression;
  }, [geographicData]);

  const getMarkerSize = (accessCount: number, maxAccessCount: number): number => {
    // Bubble size based on access count (total access count for the area)
    const normalized = maxAccessCount > 0 ? accessCount / maxAccessCount : 0;
    if (aggregationLevel === 'address') {
      return Math.max(5, Math.min(15, normalized * 10 + 5));
    }
    return Math.max(15, Math.min(60, normalized * 50 + 15));
  };

  const getMarkerOpacity = (avgAccessRate: number): number => {
    return Math.max(0.5, Math.min(1.0, avgAccessRate));
  };

  const getHeatIntensity = (area: GeographicAggregate, allAreas: GeographicAggregate[]): number => {
    // Calculate density-based intensity for heat map based on property count
    const maxCount = Math.max(...allAreas.map(a => a.propertyCount));
    return maxCount > 0 ? area.propertyCount / maxCount : 0;
  };

  const getColorByAccessRate = (avgAccessRate: number): string => {
    // Color gradient based on access rate
    if (avgAccessRate >= 0.9) return '#10b981'; // Green - high access
    if (avgAccessRate >= 0.75) return '#3b82f6'; // Blue - good access
    if (avgAccessRate >= 0.6) return '#f59e0b'; // Orange - moderate access
    if (avgAccessRate >= 0.4) return '#ef4444'; // Red - low access
    return '#6b7280'; // Gray - very low access
  };

  const stats = useMemo(() => {
    const total = geographicData.length;
    const totalProperties = geographicData.reduce((sum, d) => sum + d.propertyCount, 0);
    const avgAccessRate = geographicData.length > 0
      ? geographicData.reduce((sum, d) => sum + d.avgAccessRate, 0) / geographicData.length
      : 0;
    const totalAccessCount = geographicData.reduce((sum, d) => sum + d.totalAccessCount, 0);
    const avgPrice = geographicData.length > 0
      ? geographicData.reduce((sum, d) => sum + d.avgPrice, 0) / geographicData.length
      : 0;
    const totalValue = geographicData.reduce((sum, d) => sum + d.totalValue, 0);

    return { total, totalProperties, avgAccessRate, totalAccessCount, avgPrice, totalValue };
  }, [geographicData]);

  const maxAccessCount = useMemo(() => {
    return Math.max(...geographicData.map(d => d.totalAccessCount), 1);
  }, [geographicData]);

  const currentLevelInfo = useMemo(() => {
    return aggregationLevels.find(level => level.value === aggregationLevel);
  }, [aggregationLevel]);

  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
      >
        <p className="text-slate-400 text-center">No properties available for mapping</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Geospatial Analysis</h3>
            <p className="text-slate-400 text-sm">Access Counts by Geographic Area</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Aggregation Level Selector */}
        <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
          <Globe className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={aggregationLevel}
            onChange={(e) => setAggregationLevel(e.target.value as AggregationLevel)}
            className="bg-transparent text-white text-sm px-3 py-2 border-none outline-none cursor-pointer min-w-[180px]"
          >
            {aggregationLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {currentLevelInfo && (
            <span className="text-slate-500 text-xs px-2 hidden sm:inline">
              {currentLevelInfo.description}
            </span>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
          <button
            onClick={() => setMapView('bubble')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mapView === 'bubble'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Bubble Map
          </button>
          <button
            onClick={() => setMapView('heat')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mapView === 'heat'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Heat Map
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value as PriceRange)}
            className="bg-transparent text-white text-sm px-3 py-2 border-none outline-none cursor-pointer"
          >
            <option value="all">All Price Ranges</option>
            {priceSegments.map(seg => (
              <option key={seg.label} value={seg.label.toLowerCase().replace('-', '')}>
                {seg.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-4 text-sm flex-wrap">
          <div className="text-slate-400">
            <span className="text-white font-semibold">{stats.total}</span>{' '}
            {aggregationLevel === 'address' ? 'properties' :
             aggregationLevel === 'state' ? 'states' :
             aggregationLevel === 'zip' ? 'ZIP codes' :
             aggregationLevel === 'neighborhood' ? 'neighborhoods' : 'cities'}
          </div>
          <div className="text-slate-400">
            <span className="text-white font-semibold">{stats.totalProperties}</span> properties
          </div>
          <div className="text-slate-400">
            Avg Access: <span className="text-white font-semibold">{(stats.avgAccessRate * 100).toFixed(1)}%</span>
          </div>
          <div className="text-slate-400">
            Total Access: <span className="text-white font-semibold">{stats.totalAccessCount.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700" style={{ height: '600px' }}>
        <MapContainer
          center={[37.7749, -122.4194]}
          zoom={6}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBounds bounds={mapBounds} />

          {geographicData.map((area) => {
            const size = getMarkerSize(area.totalAccessCount, maxAccessCount);
            const opacity = getMarkerOpacity(area.avgAccessRate);
            const intensity = getHeatIntensity(area, geographicData);
            const color = getColorByAccessRate(area.avgAccessRate);

            if (mapView === 'bubble') {
              return (
                <CircleMarker
                  key={area.key}
                  center={[area.latitude, area.longitude]}
                  radius={size}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: opacity,
                    color: '#ffffff',
                    weight: aggregationLevel === 'address' ? 1 : 2,
                    opacity: 0.8,
                  }}
                  eventHandlers={{
                    mouseover: () => setHoveredArea(area),
                    mouseout: () => setHoveredArea(null),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold text-slate-900 mb-2">{area.label}</div>
                      <div className="space-y-1 text-slate-700">
                        {aggregationLevel !== 'address' && (
                          <>
                            <div><strong>Properties:</strong> {area.propertyCount}</div>
                            <div><strong>Total Access Count:</strong> {area.totalAccessCount.toFixed(1)}</div>
                            <div><strong>Avg Access Rate:</strong> {(area.avgAccessRate * 100).toFixed(1)}%</div>
                            <div><strong>Avg Price:</strong> ${(area.avgPrice / 1000).toFixed(0)}k</div>
                            <div><strong>Total Value:</strong> ${(area.totalValue / 1000000).toFixed(2)}M</div>
                            <div><strong>Avg ROI:</strong> {area.avgROI.toFixed(2)}%</div>
                          </>
                        )}
                        {aggregationLevel === 'address' && area.properties[0] && (
                          <>
                            <div><strong>Address:</strong> {area.properties[0].address}</div>
                            <div><strong>City:</strong> {area.properties[0].city}, {area.properties[0].state}</div>
                            <div><strong>ZIP:</strong> {area.properties[0].zipCode}</div>
                            <div><strong>Access Rate:</strong> {(area.avgAccessRate * 100).toFixed(1)}%</div>
                            <div><strong>Value:</strong> ${(area.avgPrice / 1000).toFixed(0)}k</div>
                            <div><strong>ROI:</strong> {area.avgROI.toFixed(2)}%</div>
                            <div><strong>Rent:</strong> ${area.properties[0].monthlyRent.toLocaleString()}/mo</div>
                          </>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            } else {
              // Heat map view - use opacity and size based on density and access rate
              const heatOpacity = intensity * opacity;
              return (
                <CircleMarker
                  key={area.key}
                  center={[area.latitude, area.longitude]}
                  radius={size * (1 + intensity * 0.5)}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: heatOpacity,
                    color: color,
                    weight: aggregationLevel === 'address' ? 1 : 2,
                    opacity: heatOpacity * 0.7,
                  }}
                  eventHandlers={{
                    mouseover: () => setHoveredArea(area),
                    mouseout: () => setHoveredArea(null),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold text-slate-900 mb-2">{area.label}</div>
                      <div className="space-y-1 text-slate-700">
                        {aggregationLevel !== 'address' && (
                          <>
                            <div><strong>Properties:</strong> {area.propertyCount}</div>
                            <div><strong>Total Access Count:</strong> {area.totalAccessCount.toFixed(1)}</div>
                            <div><strong>Avg Access Rate:</strong> {(area.avgAccessRate * 100).toFixed(1)}%</div>
                            <div><strong>Avg Price:</strong> ${(area.avgPrice / 1000).toFixed(0)}k</div>
                            <div><strong>Total Value:</strong> ${(area.totalValue / 1000000).toFixed(2)}M</div>
                            <div><strong>Avg ROI:</strong> {area.avgROI.toFixed(2)}%</div>
                            <div><strong>Density:</strong> {(intensity * 100).toFixed(0)}%</div>
                          </>
                        )}
                        {aggregationLevel === 'address' && area.properties[0] && (
                          <>
                            <div><strong>Address:</strong> {area.properties[0].address}</div>
                            <div><strong>City:</strong> {area.properties[0].city}, {area.properties[0].state}</div>
                            <div><strong>ZIP:</strong> {area.properties[0].zipCode}</div>
                            <div><strong>Access Rate:</strong> {(area.avgAccessRate * 100).toFixed(1)}%</div>
                            <div><strong>Value:</strong> ${(area.avgPrice / 1000).toFixed(0)}k</div>
                            <div><strong>ROI:</strong> {area.avgROI.toFixed(2)}%</div>
                          </>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            }
          })}
        </MapContainer>

        {/* Hover Tooltip */}
        {hoveredArea && (
          <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl z-[1000] min-w-[200px]">
            <div className="font-semibold text-white mb-2">{hoveredArea.label}</div>
            <div className="space-y-1 text-xs">
              {aggregationLevel !== 'address' && (
                <>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Properties:</span>{' '}
                    <span className="text-white font-semibold">{hoveredArea.propertyCount}</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Access Count:</span>{' '}
                    <span className="text-white font-semibold">{hoveredArea.totalAccessCount.toFixed(1)}</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Avg Access Rate:</span>{' '}
                    <span className="text-white font-semibold">{(hoveredArea.avgAccessRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Total Value:</span>{' '}
                    <span className="text-white font-semibold">${(hoveredArea.totalValue / 1000000).toFixed(2)}M</span>
                  </div>
                </>
              )}
              {aggregationLevel === 'address' && hoveredArea.properties[0] && (
                <>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Access Rate:</span>{' '}
                    <span className="text-white font-semibold">{(hoveredArea.avgAccessRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Value:</span>{' '}
                    <span className="text-white font-semibold">${(hoveredArea.avgPrice / 1000).toFixed(0)}k</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex flex-wrap items-start gap-6">
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Access Rate Colors</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-slate-400 text-xs">High Access (≥90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-slate-400 text-xs">Good Access (75-90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-slate-400 text-xs">Moderate Access (60-75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-slate-400 text-xs">Low Access (40-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500" />
                <span className="text-slate-400 text-xs">Very Low Access (&lt;40%)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Marker Size</h4>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className={`rounded-full bg-indigo-500/50 ${aggregationLevel === 'address' ? 'w-2 h-2' : 'w-4 h-4'}`} />
                <span className="text-slate-400 text-xs">Low Count</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`rounded-full bg-indigo-500/70 ${aggregationLevel === 'address' ? 'w-4 h-4' : 'w-8 h-8'}`} />
                <span className="text-slate-400 text-xs">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`rounded-full bg-indigo-500 ${aggregationLevel === 'address' ? 'w-6 h-6' : 'w-12 h-12'}`} />
                <span className="text-slate-400 text-xs">High Count</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-2">Size = Total Access Count</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
