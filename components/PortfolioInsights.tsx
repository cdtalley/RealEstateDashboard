'use client';

import { PortfolioMetrics, Property } from '@/lib/types';
import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';

interface PortfolioInsightsProps {
  metrics: PortfolioMetrics;
  properties: Property[];
}

export default function PortfolioInsights({ metrics, properties }: PortfolioInsightsProps) {
  const insights = [
    {
      type: 'opportunity',
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Optimization Opportunity',
      message: `${properties.filter(p => p.occupancyRate < 0.85).length} properties below 85% occupancy. Consider rent adjustments or marketing.`,
      color: 'blue',
    },
    {
      type: 'success',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Strong Performance',
      message: `Portfolio ROI of ${metrics.averageROI.toFixed(1)}% exceeds market average of 6.5%. Excellent positioning.`,
      color: 'green',
    },
    {
      type: 'warning',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Maintenance Alert',
      message: `${properties.filter(p => p.occupancyStatus === 'Maintenance').length} properties require attention. Schedule inspections.`,
      color: 'yellow',
    },
    {
      type: 'recommendation',
      icon: <Target className="w-5 h-5" />,
      title: 'Strategic Recommendation',
      message: `Consider acquiring ${properties.filter(p => p.roi > 8).length} similar high-ROI properties in ${properties.filter(p => p.roi > 8).length > 0 ? properties.find(p => p.roi > 8)?.city : 'target markets'}.`,
      color: 'purple',
    },
  ];

  const topPerformers = properties
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3)
    .map(p => `${p.address.split(' ')[0]} ${p.city}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">AI Portfolio Insights</h3>
          <p className="text-slate-400 text-sm">Actionable recommendations & alerts</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              insight.color === 'blue'
                ? 'bg-blue-500/10 border-blue-500/20'
                : insight.color === 'green'
                ? 'bg-green-500/10 border-green-500/20'
                : insight.color === 'yellow'
                ? 'bg-yellow-500/10 border-yellow-500/20'
                : 'bg-purple-500/10 border-purple-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`${
                  insight.color === 'blue'
                    ? 'text-blue-400'
                    : insight.color === 'green'
                    ? 'text-green-400'
                    : insight.color === 'yellow'
                    ? 'text-yellow-400'
                    : 'text-purple-400'
                }`}
              >
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{insight.title}</h4>
                <p className="text-slate-300 text-sm">{insight.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-white font-medium mb-3">Top Performers</h4>
        <div className="flex flex-wrap gap-2">
          {topPerformers.map((performer, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium"
            >
              {performer}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

