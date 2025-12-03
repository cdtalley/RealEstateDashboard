'use client';

import { Property } from '@/lib/types';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ComposedChart, Area, AreaChart } from 'recharts';
import { DollarSign, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

interface PriceSegmentAnalysisProps {
  properties: Property[];
}

interface PriceSegment {
  range: string;
  min: number;
  max: number;
  count: number;
  avgOccupancyRate: number;
  avgROI: number;
  avgCapRate: number;
  avgMonthlyRent: number;
  totalValue: number;
  accessRate: number; // Occupancy rate as access rate
  properties: Property[];
}

export default function PriceSegmentAnalysis({ properties }: PriceSegmentAnalysisProps) {
  const segments = useMemo(() => {
    if (!properties || properties.length === 0) {
      return [];
    }
    
    const sorted = [...properties].sort((a, b) => a.currentValue - b.currentValue);
    const minPrice = sorted[0]?.currentValue || 0;
    const maxPrice = sorted[sorted.length - 1]?.currentValue || 0;
    
    // Define price segments
    const segmentRanges = [
      { label: 'Economy', min: 0, max: 200000 },
      { label: 'Entry', min: 200000, max: 400000 },
      { label: 'Mid-Market', min: 400000, max: 600000 },
      { label: 'Premium', min: 600000, max: 800000 },
      { label: 'Luxury', min: 800000, max: Infinity },
    ];

    return segmentRanges.map(range => {
      const segmentProps = properties.filter(
        p => {
          if (range.max === Infinity) {
            return p.currentValue >= range.min;
          }
          return p.currentValue >= range.min && p.currentValue < range.max;
        }
      );

      if (segmentProps.length === 0) return null;

      const avgOccupancyRate = segmentProps.reduce((sum, p) => sum + p.occupancyRate, 0) / segmentProps.length;
      const avgROI = segmentProps.reduce((sum, p) => sum + p.roi, 0) / segmentProps.length;
      const avgCapRate = segmentProps.reduce((sum, p) => sum + p.capRate, 0) / segmentProps.length;
      const avgMonthlyRent = segmentProps.reduce((sum, p) => sum + p.monthlyRent, 0) / segmentProps.length;
      const totalValue = segmentProps.reduce((sum, p) => sum + p.currentValue, 0);

      return {
        range: range.label,
        min: range.min,
        max: range.max === Infinity ? maxPrice : range.max,
        count: segmentProps.length,
        avgOccupancyRate,
        avgROI,
        avgCapRate,
        avgMonthlyRent,
        totalValue,
        accessRate: avgOccupancyRate, // Access rate = occupancy rate
        properties: segmentProps,
      };
    }).filter((s): s is PriceSegment => s !== null);
  }, [properties]);

  const chartData = segments.map(s => ({
    segment: s.range,
    accessRate: s.accessRate * 100,
    occupancyRate: s.avgOccupancyRate * 100,
    roi: s.avgROI,
    count: s.count,
    avgRent: s.avgMonthlyRent,
    totalValue: s.totalValue / 1000000,
  }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Price Segment Analysis</h3>
            <p className="text-slate-400 text-sm">Access Rates & Performance by Price Tier</p>
          </div>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.range}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold text-sm">{segment.range}</h4>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
            </div>
            <p className="text-slate-400 text-xs mb-3">
              ${(segment.min / 1000).toFixed(0)}k - ${segment.max === Infinity ? '∞' : (segment.max / 1000).toFixed(0) + 'k'}
            </p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Access Rate</span>
                  <span className="text-white font-semibold">
                    {(segment.accessRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.accessRate * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-600">
                <span className="text-slate-400">Properties</span>
                <span className="text-white font-semibold">{segment.count}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Avg ROI</span>
                <span className="text-green-400 font-semibold">{segment.avgROI.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Access Rate Comparison Chart */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Access Rate by Price Segment
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="segment" 
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Access Rate']}
            />
            <Bar dataKey="accessRate" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics Comparison */}
      <div>
        <h4 className="text-white font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          ROI vs Access Rate by Segment
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="segment" 
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              label={{ value: 'Access Rate (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              label={{ value: 'ROI (%)', angle: 90, position: 'insideRight', fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Bar 
              yAxisId="left"
              dataKey="accessRate" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="roi" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-white font-medium mb-4">Segment Performance Summary</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-medium text-xs">Segment</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium text-xs">Properties</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium text-xs">Total Value</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium text-xs">Access Rate</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium text-xs">Avg ROI</th>
                <th className="text-right py-2 px-3 text-slate-400 font-medium text-xs">Avg Rent</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment, index) => (
                <tr key={segment.range} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors[index] }}
                      />
                      <span className="text-white text-sm font-medium">{segment.range}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-white text-sm text-right">{segment.count}</td>
                  <td className="py-3 px-3 text-white text-sm text-right">
                    ${(segment.totalValue / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-white text-sm font-semibold">
                      {(segment.accessRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-green-400 text-sm font-semibold">
                      {segment.avgROI.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white text-sm text-right">
                    ${segment.avgMonthlyRent.toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

