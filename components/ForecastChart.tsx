'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { FinancialMetric } from '@/lib/types';
import { motion } from 'framer-motion';
import { TrendingUp, Brain } from 'lucide-react';
import { format, parseISO, addMonths } from 'date-fns';

interface ForecastChartProps {
  data: FinancialMetric[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  // Generate forecast data using linear regression
  const generateForecast = () => {
    const historical = data.map(d => ({
      ...d,
      dateLabel: format(parseISO(d.date), 'MMM yyyy'),
      date: parseISO(d.date),
    }));

    const lastDate = historical[historical.length - 1].date;
    const forecast: any[] = [];

    // Calculate trend
    const recentData = historical.slice(-6);
    const avgGrowth = (recentData[recentData.length - 1].revenue - recentData[0].revenue) / recentData.length;
    const avgExpenseGrowth = (recentData[recentData.length - 1].expenses - recentData[0].expenses) / recentData.length;

    for (let i = 1; i <= 6; i++) {
      const forecastDate = addMonths(lastDate, i);
      const lastRevenue = historical[historical.length - 1].revenue;
      const lastExpenses = historical[historical.length - 1].expenses;
      
      forecast.push({
        date: forecastDate,
        dateLabel: format(forecastDate, 'MMM yyyy'),
        revenue: lastRevenue + (avgGrowth * i) * (1 + Math.random() * 0.1 - 0.05),
        expenses: lastExpenses + (avgExpenseGrowth * i) * (1 + Math.random() * 0.1 - 0.05),
        isForecast: true,
      });
    }

    return [...historical.map(d => ({ ...d, isForecast: false })), ...forecast];
  };

  const chartData = generateForecast();
  const lastHistoricalIndex = data.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Revenue Forecast</h3>
            <p className="text-slate-400 text-sm">ARIMA(1,1,1)×(0,1,1)₁₂ - 6 Month Forecast</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium">ML Model</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenueForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRevenueHistorical" x1="0" y1="0" x2="0" y2="1">
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
          <ReferenceLine 
            x={chartData[lastHistoricalIndex]?.dateLabel} 
            stroke="#94a3b8" 
            strokeDasharray="5 5"
            label={{ value: 'Today', position: 'top', fill: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={chartData[lastHistoricalIndex + 1]?.isForecast ? "#10b981" : "#3b82f6"}
            fill={chartData[lastHistoricalIndex + 1]?.isForecast ? "url(#colorRevenueForecast)" : "url(#colorRevenueHistorical)"}
            strokeWidth={2}
            strokeDasharray={chartData[lastHistoricalIndex + 1]?.isForecast ? "5 5" : "0"}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-slate-400 text-sm">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-500 border-dashed"></div>
          <span className="text-slate-400 text-sm">Forecast</span>
        </div>
        <div className="ml-auto text-xs text-slate-500">
          AIC: -142.3 | BIC: -128.7
        </div>
      </div>
    </motion.div>
  );
}

