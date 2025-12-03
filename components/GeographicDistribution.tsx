'use client';

import { Property } from '@/lib/types';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface GeographicDistributionProps {
  properties: Property[];
}

export default function GeographicDistribution({ properties }: GeographicDistributionProps) {
  const cityStats = useMemo(() => {
    const stats = new Map<string, { count: number; totalValue: number; avgRent: number }>();
    
    properties.forEach(prop => {
      const key = `${prop.city}, ${prop.state}`;
      const existing = stats.get(key) || { count: 0, totalValue: 0, avgRent: 0 };
      stats.set(key, {
        count: existing.count + 1,
        totalValue: existing.totalValue + prop.currentValue,
        avgRent: existing.avgRent + prop.monthlyRent,
      });
    });

    return Array.from(stats.entries()).map(([city, data]) => ({
      city,
      count: data.count,
      totalValue: data.totalValue,
      avgRent: data.avgRent / data.count,
      percentage: (data.count / properties.length) * 100,
    })).sort((a, b) => b.count - a.count);
  }, [properties]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Geographic Distribution</h3>
            <p className="text-slate-400 text-sm">Properties by Location</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cityStats.map((stat, index) => (
          <div
            key={stat.city}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium text-sm">{stat.city}</h4>
              <span className="text-slate-400 text-xs">{stat.percentage.toFixed(1)}%</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Properties:</span>
                <span className="text-white font-semibold">{stat.count}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Value:</span>
                <span className="text-white font-semibold">
                  ${(stat.totalValue / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Avg Rent:</span>
                <span className="text-white font-semibold">
                  ${stat.avgRent.toFixed(0)}/mo
                </span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-slate-600 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full bg-gradient-to-r from-red-500 to-orange-500"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

