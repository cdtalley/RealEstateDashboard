'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FinancialMetric } from '@/lib/types';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface OccupancyChartProps {
  data: FinancialMetric[];
}

export default function OccupancyChart({ data }: OccupancyChartProps) {
  const chartData = data.map(d => ({
    ...d,
    dateLabel: format(parseISO(d.date), 'MMM yyyy'),
    occupancyPercent: d.occupancyRate * 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Occupancy Rate</h3>
            <p className="text-slate-400 text-sm">24 Month Trend</p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="dateLabel" 
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
            domain={[80, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Occupancy']}
          />
          <Area
            type="monotone"
            dataKey="occupancyPercent"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorOccupancy)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Average Occupancy</span>
          <span className="text-white font-semibold">
            {(chartData.reduce((sum, d) => sum + d.occupancyPercent, 0) / chartData.length).toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

