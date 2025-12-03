'use client';

import { Property } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Home, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface PropertyTableProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

type SortField = 'address' | 'city' | 'currentValue' | 'monthlyRent' | 'occupancyRate' | 'roi';
type SortDirection = 'asc' | 'desc';

export default function PropertyTable({ properties, onPropertyClick }: PropertyTableProps) {
  const [sortField, setSortField] = useState<SortField>('currentValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedAndFilteredProperties = useMemo(() => {
    let filtered = properties;

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.address.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.state.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [properties, sortField, sortDirection, filterType, searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-primary-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary-400" />
    );
  };

  const propertyTypes = ['all', 'Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Property Portfolio</h3>
            <p className="text-slate-400 text-sm">{sortedAndFilteredProperties.length} properties</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
        >
          {propertyTypes.map(type => (
            <option key={type} value={type} className="bg-slate-800">
              {type === 'all' ? 'All Types' : type}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th
                className="text-left py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('address')}
              >
                <div className="flex items-center gap-2">
                  Address
                  <SortIcon field="address" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('city')}
              >
                <div className="flex items-center gap-2">
                  Location
                  <SortIcon field="city" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Type</th>
              <th
                className="text-right py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('currentValue')}
              >
                <div className="flex items-center justify-end gap-2">
                  Value
                  <SortIcon field="currentValue" />
                </div>
              </th>
              <th
                className="text-right py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('monthlyRent')}
              >
                <div className="flex items-center justify-end gap-2">
                  Rent
                  <SortIcon field="monthlyRent" />
                </div>
              </th>
              <th
                className="text-right py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('occupancyRate')}
              >
                <div className="flex items-center justify-end gap-2">
                  Occupancy
                  <SortIcon field="occupancyRate" />
                </div>
              </th>
              <th
                className="text-right py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('roi')}
              >
                <div className="flex items-center justify-end gap-2">
                  ROI
                  <SortIcon field="roi" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredProperties.slice(0, 50).map((property) => (
              <tr
                key={property.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => onPropertyClick?.(property)}
              >
                <td className="py-3 px-4 text-white text-sm">{property.address}</td>
                <td className="py-3 px-4 text-slate-300 text-sm">
                  {property.city}, {property.state}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                    {property.propertyType}
                  </span>
                </td>
                <td className="py-3 px-4 text-white text-sm text-right">
                  ${(property.currentValue / 1000).toFixed(0)}k
                </td>
                <td className="py-3 px-4 text-white text-sm text-right">
                  ${property.monthlyRent.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-white text-sm">
                      {(property.occupancyRate * 100).toFixed(0)}%
                    </span>
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                        style={{ width: `${property.occupancyRate * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`text-sm font-semibold ${
                      property.roi > 8 ? 'text-green-400' : property.roi > 5 ? 'text-yellow-400' : 'text-red-400'
                    }`}
                  >
                    {property.roi.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedAndFilteredProperties.length > 50 && (
        <div className="mt-4 text-center text-slate-400 text-sm">
          Showing 50 of {sortedAndFilteredProperties.length} properties
        </div>
      )}
    </motion.div>
  );
}

