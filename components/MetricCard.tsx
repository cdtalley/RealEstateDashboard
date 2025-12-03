'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: ReactNode;
  subtitle?: string;
  animated?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  subtitle,
  animated = false,
  prefix = '',
  suffix = '',
  decimals = 0,
}: MetricCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-primary-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-2 bg-primary-500/10 rounded-lg text-primary-400"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
            {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between relative">
        {animated && typeof value === 'number' ? (
          <p className="text-3xl font-bold text-white">
            <AnimatedCounter
              value={numericValue}
              duration={2}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
            />
          </p>
        ) : (
          <p className="text-3xl font-bold text-white">{value}</p>
        )}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </motion.div>
      </div>
      {trend === 'up' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
}

