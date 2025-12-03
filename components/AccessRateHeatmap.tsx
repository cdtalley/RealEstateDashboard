'use client';

import { Property } from '@/lib/types';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Activity } from 'lucide-react';

interface AccessRateHeatmapProps {
  properties: Property[];
}

export default function AccessRateHeatmap({ properties }: AccessRateHeatmapProps) {
  const heatmapData = useMemo(() => {
    if (!properties || properties.length === 0) {
      return { data: [], priceBuckets: [], occupancyBuckets: [] };
    }
    const priceBuckets = [
      { min: 0, max: 200000, label: '$0-200k' },
      { min: 200000, max: 400000, label: '$200-400k' },
      { min: 400000, max: 600000, label: '$400-600k' },
      { min: 600000, max: 800000, label: '$600-800k' },
      { min: 800000, max: Infinity, label: '$800k+' },
    ];

    const occupancyBuckets = [
      { min: 0, max: 0.5, label: '0-50%' },
      { min: 0.5, max: 0.7, label: '50-70%' },
      { min: 0.7, max: 0.85, label: '70-85%' },
      { min: 0.85, max: 0.95, label: '85-95%' },
      { min: 0.95, max: 1.0, label: '95-100%' },
    ];

    const data: { priceRange: string; occupancyRange: string; count: number; avgROI: number }[] = [];

    priceBuckets.forEach(priceBucket => {
      occupancyBuckets.forEach(occBucket => {
        const matching = properties.filter(
          p =>
            p.currentValue >= priceBucket.min &&
            p.currentValue < priceBucket.max &&
            p.occupancyRate >= occBucket.min &&
            p.occupancyRate < occBucket.max
        );

        if (matching.length > 0) {
          const avgROI = matching.reduce((sum, p) => sum + p.roi, 0) / matching.length;
          data.push({
            priceRange: priceBucket.label,
            occupancyRange: occBucket.label,
            count: matching.length,
            avgROI,
          });
        }
      });
    });

    return { data, priceBuckets, occupancyBuckets };
  }, [properties]);

  const maxCount = heatmapData.data.length > 0 ? Math.max(...heatmapData.data.map(d => d.count)) : 1;
  const maxROI = heatmapData.data.length > 0 ? Math.max(...heatmapData.data.map(d => d.avgROI)) : 1;

  const getIntensity = (count: number) => {
    return Math.min(count / maxCount, 1);
  };

  const getColor = (intensity: number, roi: number) => {
    const baseIntensity = intensity * 0.7 + 0.3;
    const roiFactor = roi / maxROI;
    
    if (roiFactor > 0.7) {
      return `rgba(16, 185, 129, ${baseIntensity})`;
    } else if (roiFactor > 0.5) {
      return `rgba(59, 130, 246, ${baseIntensity})`;
    } else {
      return `rgba(245, 158, 11, ${baseIntensity})`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Access Rate Heatmap</h3>
            <p className="text-slate-400 text-sm">Property Distribution by Price & Access Rate</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex mb-2">
            <div className="w-32 flex-shrink-0"></div>
            {heatmapData.priceBuckets.map(bucket => (
              <div key={bucket.label} className="flex-1 text-center">
                <p className="text-slate-400 text-xs font-medium">{bucket.label}</p>
              </div>
            ))}
          </div>

          {heatmapData.occupancyBuckets.map((occBucket, occIndex) => (
            <div key={occBucket.label} className="flex mb-1">
              <div className="w-32 flex-shrink-0 flex items-center">
                <p className="text-slate-300 text-xs font-medium">{occBucket.label}</p>
              </div>
              {heatmapData.priceBuckets.map((priceBucket, priceIndex) => {
                const cellData = heatmapData.data.find(
                  d => d.priceRange === priceBucket.label && d.occupancyRange === occBucket.label
                );

                if (!cellData) {
                  return (
                    <div
                      key={`${occIndex}-${priceIndex}`}
                      className="flex-1 h-16 bg-slate-700/20 rounded mx-0.5 border border-slate-700/30"
                    />
                  );
                }

                const intensity = getIntensity(cellData.count);
                const color = getColor(intensity, cellData.avgROI);

                return (
                  <motion.div
                    key={`${occIndex}-${priceIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (occIndex * 5 + priceIndex) * 0.02 }}
                    className="flex-1 h-16 rounded mx-0.5 border border-slate-600/50 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform relative group"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-white font-bold text-sm">{cellData.count}</span>
                    <span className="text-white/80 text-xs">ROI: {cellData.avgROI.toFixed(1)}%</span>
                    
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl min-w-[150px]">
                      <p className="text-white text-xs font-semibold mb-1">
                        {priceBucket.label} • {occBucket.label}
                      </p>
                      <p className="text-slate-300 text-xs">Properties: {cellData.count}</p>
                      <p className="text-slate-300 text-xs">Avg ROI: {cellData.avgROI.toFixed(2)}%</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/70"></div>
              <span className="text-slate-400 text-xs">High ROI (&gt;7%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/70"></div>
              <span className="text-slate-400 text-xs">Medium ROI (5-7%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500/70"></div>
              <span className="text-slate-400 text-xs">Lower ROI (&lt;5%)</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs">
            Intensity = Property Count • Color = ROI Performance
          </p>
        </div>
      </div>
    </motion.div>
  );
}
