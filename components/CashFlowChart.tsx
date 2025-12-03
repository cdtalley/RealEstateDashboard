'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FinancialMetric } from '@/lib/types';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CashFlowChartProps {
  data: FinancialMetric[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = data.slice(-12).map(d => ({
    ...d,
    dateLabel: format(parseISO(d.date), 'MMM yyyy'),
    netIncomeK: d.netIncome / 1000,
    positive: d.netIncome > 0,
  }));

  const totalCashFlow = chartData.reduce((sum, d) => sum + d.netIncome, 0);
  const avgMonthly = totalCashFlow / chartData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Cash Flow Analysis</h3>
            <p className="text-slate-400 text-sm">Monthly Net Income (12 Months)</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Avg Monthly</p>
          <p className={`text-lg font-bold ${avgMonthly > 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${(avgMonthly / 1000).toFixed(1)}k
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="dateLabel" 
            stroke="#94a3b8"
            fontSize={11}
            tick={{ fill: '#94a3b8' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
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
            formatter={(value: number) => [`$${(value * 1000).toLocaleString()}`, 'Net Income']}
          />
          <Bar dataKey="netIncomeK" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.positive ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-slate-400 text-xs">Total Cash Flow</p>
            <p className={`text-lg font-bold ${totalCashFlow > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${(totalCashFlow / 1000000).toFixed(2)}M
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Positive Months</p>
            <p className="text-lg font-bold text-white">
              {chartData.filter(d => d.positive).length}/12
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Growth Rate</p>
            <p className="text-lg font-bold text-green-400">
              +{((chartData[chartData.length - 1].netIncome - chartData[0].netIncome) / Math.abs(chartData[0].netIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

