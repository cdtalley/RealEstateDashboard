'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MarketTrend } from '@/lib/types';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface MarketTrendsChartProps {
  data: MarketTrend[];
}

export default function MarketTrendsChart({ data }: MarketTrendsChartProps) {
  const chartData = data.map(d => ({
    ...d,
    averagePriceK: d.averagePrice / 1000,
    averageRentK: d.averageRent / 1000,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Market Trends</h3>
            <p className="text-slate-400 text-sm">36 Month Analysis</p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="month" 
            stroke="#94a3b8"
            fontSize={11}
            tick={{ fill: '#94a3b8' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="left"
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => `$${value}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => `$${value}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number, name: string) => {
              if (name === 'averagePriceK') return [`$${value.toFixed(0)}k`, 'Avg Price'];
              if (name === 'averageRentK') return [`$${value.toFixed(1)}k`, 'Avg Rent'];
              return [value, name];
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="averagePriceK"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
            name="Average Price"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="averageRentK"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name="Average Rent"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-slate-400 text-sm">Average Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-slate-400 text-sm">Average Rent</span>
        </div>
      </div>
    </motion.div>
  );
}

