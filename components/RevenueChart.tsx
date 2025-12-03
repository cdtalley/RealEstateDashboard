'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FinancialMetric } from '@/lib/types';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface RevenueChartProps {
  data: FinancialMetric[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(d => ({
    ...d,
    dateLabel: format(parseISO(d.date), 'MMM yyyy'),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Revenue & Expenses</h3>
            <p className="text-slate-400 text-sm">24 Month Trend</p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => [`$${(value / 1000).toFixed(1)}k`, '']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorExpenses)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-slate-400 text-sm">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-slate-400 text-sm">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}

