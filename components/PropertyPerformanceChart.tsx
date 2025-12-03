'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PropertyPerformance } from '@/lib/types';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface PropertyPerformanceChartProps {
  data: PropertyPerformance[];
}

export default function PropertyPerformanceChart({ data }: PropertyPerformanceChartProps) {
  const chartData = data.map(d => ({
    ...d,
    name: d.propertyName.length > 20 ? d.propertyName.substring(0, 20) + '...' : d.propertyName,
    netIncomeK: d.netIncome / 1000,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Top Performing Properties</h3>
            <p className="text-slate-400 text-sm">Annual Net Income</p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            type="number"
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => `$${value}k`}
          />
          <YAxis 
            type="category"
            dataKey="name"
            stroke="#94a3b8"
            fontSize={11}
            tick={{ fill: '#94a3b8' }}
            width={150}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => [`$${(value * 1000).toLocaleString()}`, 'Net Income']}
          />
          <Bar dataKey="netIncomeK" fill="#06b6d4" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

