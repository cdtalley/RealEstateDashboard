'use client';

import { Property, FinancialMetric } from '@/lib/types';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { TrendingUp, Activity, BarChart3, Target } from 'lucide-react';

interface StatisticalAnalysisProps {
  properties: Property[];
  financialMetrics: FinancialMetric[];
}

export default function StatisticalAnalysis({ properties, financialMetrics }: StatisticalAnalysisProps) {
  // Calculate correlation coefficient between price and ROI
  const correlationAnalysis = useMemo(() => {
    const n = properties.length;
    const meanPrice = properties.reduce((sum, p) => sum + p.currentValue, 0) / n;
    const meanROI = properties.reduce((sum, p) => sum + p.roi, 0) / n;

    let numerator = 0;
    let sumSqPrice = 0;
    let sumSqROI = 0;

    properties.forEach(p => {
      const priceDiff = p.currentValue - meanPrice;
      const roiDiff = p.roi - meanROI;
      numerator += priceDiff * roiDiff;
      sumSqPrice += priceDiff * priceDiff;
      sumSqROI += roiDiff * roiDiff;
    });

    const correlation = numerator / Math.sqrt(sumSqPrice * sumSqROI);
    
    // Calculate p-value approximation (simplified)
    const tStat = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
    const pValue = 2 * (1 - Math.abs(tStat) / Math.sqrt(n - 2)); // Simplified approximation
    
    return {
      correlation: correlation,
      pValue: Math.min(pValue, 0.001),
      significance: pValue < 0.05 ? 'Significant' : 'Not Significant',
      strength: Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.4 ? 'Moderate' : 'Weak',
    };
  }, [properties]);

  // Linear regression: ROI = a + b * log(Price)
  const regressionModel = useMemo(() => {
    const n = properties.length;
    const logPrices = properties.map(p => Math.log(p.currentValue));
    const rois = properties.map(p => p.roi);
    
    const meanLogPrice = logPrices.reduce((sum, x) => sum + x, 0) / n;
    const meanROI = rois.reduce((sum, y) => sum + y, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = logPrices[i] - meanLogPrice;
      const yDiff = rois[i] - meanROI;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }

    const slope = numerator / denominator;
    const intercept = meanROI - slope * meanLogPrice;

    // Calculate R-squared
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i++) {
      const predicted = intercept + slope * logPrices[i];
      ssRes += Math.pow(rois[i] - predicted, 2);
      ssTot += Math.pow(rois[i] - meanROI, 2);
    }
    const rSquared = 1 - (ssRes / ssTot);

    // Calculate RMSE
    const rmse = Math.sqrt(ssRes / n);

    return {
      slope,
      intercept,
      rSquared,
      rmse,
      equation: `ROI = ${intercept.toFixed(2)} + ${slope.toFixed(2)} × ln(Price)`,
    };
  }, [properties]);

  // Time series decomposition for revenue
  const timeSeriesAnalysis = useMemo(() => {
    const revenues = financialMetrics.map(m => m.revenue);
    const n = revenues.length;
    
    // Calculate trend using moving average
    const window = 3;
    const trend: number[] = [];
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - Math.floor(window / 2));
      const end = Math.min(n, i + Math.ceil(window / 2));
      const avg = revenues.slice(start, end).reduce((sum, val) => sum + val, 0) / (end - start);
      trend.push(avg);
    }

    // Calculate seasonal component (simplified - assuming 12-month seasonality)
    const seasonal: number[] = [];
    const monthlyAvgs: number[] = [];
    for (let month = 0; month < 12; month++) {
      const monthValues: number[] = [];
      for (let i = month; i < n; i += 12) {
        monthValues.push(revenues[i] - trend[i]);
      }
      monthlyAvgs[month] = monthValues.length > 0 
        ? monthValues.reduce((sum, val) => sum + val, 0) / monthValues.length 
        : 0;
    }
    
    for (let i = 0; i < n; i++) {
      seasonal.push(monthlyAvgs[i % 12] || 0);
    }

    // Calculate growth rate
    const growthRate = ((revenues[n - 1] - revenues[0]) / revenues[0]) * 100;
    const avgMonthlyGrowth = (Math.pow(revenues[n - 1] / revenues[0], 1 / (n - 1)) - 1) * 100;

    return {
      trend,
      seasonal,
      growthRate,
      avgMonthlyGrowth,
    };
  }, [financialMetrics]);

  // Anomaly detection using IQR method
  const anomalies = useMemo(() => {
    const rois = properties.map(p => p.roi).sort((a, b) => a - b);
    const q1Index = Math.floor(rois.length * 0.25);
    const q3Index = Math.floor(rois.length * 0.75);
    const q1 = rois[q1Index];
    const q3 = rois[q3Index];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const detectedAnomalies = properties.filter(p => p.roi < lowerBound || p.roi > upperBound);

    return {
      lowerBound,
      upperBound,
      count: detectedAnomalies.length,
      percentage: (detectedAnomalies.length / properties.length) * 100,
      anomalies: detectedAnomalies.slice(0, 5),
    };
  }, [properties]);

  const scatterData = properties.slice(0, 100).map(p => ({
    price: Math.log(p.currentValue),
    roi: p.roi,
    occupancy: p.occupancyRate * 100,
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
            <h3 className="text-white font-semibold text-lg">Statistical Analysis & ML Insights</h3>
            <p className="text-slate-400 text-sm">Correlation, Regression, Time Series Decomposition</p>
          </div>
        </div>
      </div>

      {/* Correlation Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-xs">Price-ROI Correlation</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {correlationAnalysis.correlation.toFixed(3)}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded ${
              correlationAnalysis.strength === 'Strong' 
                ? 'bg-green-500/20 text-green-400' 
                : correlationAnalysis.strength === 'Moderate'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {correlationAnalysis.strength}
            </span>
            <span className="text-slate-500 text-xs">
              p &lt; {correlationAnalysis.pValue.toFixed(3)}
            </span>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-xs">Model R²</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {regressionModel.rSquared.toFixed(3)}
          </p>
          <p className="text-slate-500 text-xs">
            RMSE: {regressionModel.rmse.toFixed(2)}%
          </p>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-xs">Anomalies Detected</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {anomalies.count}
          </p>
          <p className="text-slate-500 text-xs">
            {anomalies.percentage.toFixed(1)}% of portfolio
          </p>
        </div>
      </div>

      {/* Regression Scatter Plot */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          Log-Linear Regression: ROI vs Log(Price)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="price" 
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              label={{ value: 'ln(Price)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <ZAxis dataKey="occupancy" range={[50, 400]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number, name: string) => {
                if (name === 'roi') return [`${value.toFixed(2)}%`, 'ROI'];
                if (name === 'price') return [`${Math.exp(value).toFixed(0)}`, 'Price'];
                return [value, name];
              }}
            />
            <Scatter dataKey="roi" fill="#3b82f6" />
            <ReferenceLine 
              y={regressionModel.intercept + regressionModel.slope * 12} 
              stroke="#10b981" 
              strokeDasharray="5 5"
              label={{ value: 'Regression Line', position: 'right', fill: '#10b981' }}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-slate-400">
          <p>Model: {regressionModel.equation}</p>
          <p>R² = {regressionModel.rSquared.toFixed(3)} | RMSE = {regressionModel.rmse.toFixed(2)}%</p>
        </div>
      </div>

      {/* Time Series Decomposition */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-4">Revenue Time Series Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-xs mb-2">CAGR (24 months)</p>
            <p className="text-2xl font-bold text-white">
              {timeSeriesAnalysis.growthRate.toFixed(1)}%
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Avg Monthly Growth: {timeSeriesAnalysis.avgMonthlyGrowth.toFixed(2)}%
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-xs mb-2">Trend Direction</p>
            <p className={`text-2xl font-bold ${timeSeriesAnalysis.growthRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {timeSeriesAnalysis.growthRate > 0 ? '↑ Upward' : '↓ Downward'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {timeSeriesAnalysis.growthRate > 0 ? 'Positive momentum' : 'Declining trend'}
            </p>
          </div>
        </div>
      </div>

      {/* Anomaly Details */}
      {anomalies.count > 0 && (
        <div className="pt-6 border-t border-slate-700">
          <h4 className="text-white font-medium mb-3">Outlier Detection (IQR Method)</h4>
          <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
            <p className="text-slate-300 text-sm mb-2">
              Bounds: [{anomalies.lowerBound.toFixed(2)}%, {anomalies.upperBound.toFixed(2)}%]
            </p>
            <p className="text-slate-400 text-xs">
              {anomalies.count} properties ({anomalies.percentage.toFixed(1)}%) fall outside 1.5×IQR range
            </p>
          </div>
          {anomalies.anomalies.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-medium">Sample Outliers:</p>
              {anomalies.anomalies.map((prop, idx) => (
                <div key={prop.id} className="flex items-center justify-between bg-slate-700/30 rounded px-3 py-2">
                  <span className="text-white text-xs">{prop.address}</span>
                  <span className={`text-xs font-semibold ${
                    prop.roi > anomalies.upperBound ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ROI: {prop.roi.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

