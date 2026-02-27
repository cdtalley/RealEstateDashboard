'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { PortfolioMetrics, Property, FinancialMetric, MarketTrend, PropertyPerformance } from '@/lib/types';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import OccupancyChart from './OccupancyChart';
import MarketTrendsChart from './MarketTrendsChart';
import PropertyTable from './PropertyTable';
import PropertyPerformanceChart from './PropertyPerformanceChart';
import GeographicDistribution from './GeographicDistribution';
import ForecastChart from './ForecastChart';
import CashFlowChart from './CashFlowChart';
import PortfolioInsights from './PortfolioInsights';
import PropertyDetailModal from './PropertyDetailModal';
import DateRangeSelector from './DateRangeSelector';
import PriceSegmentAnalysis from './PriceSegmentAnalysis';
import AccessRateHeatmap from './AccessRateHeatmap';
import { TrendingUp, Home, DollarSign, Users, MapPin, BarChart3 } from 'lucide-react';

// Dynamic import for map component to avoid SSR issues
const GeoSpatialMap = dynamic(() => import('./GeoSpatialMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-lg">
      <div className="h-[600px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
});

export default function Dashboard() {
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetric[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [performance, setPerformance] = useState<PropertyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [portfolioRes, propertiesRes, metricsRes, trendsRes, performanceRes] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/properties'),
          fetch('/api/metrics'),
          fetch('/api/market-trends'),
          fetch('/api/performance'),
        ]);

        const [portfolio, props, metrics, trends, perf] = await Promise.all([
          portfolioRes.json(),
          propertiesRes.json(),
          metricsRes.json(),
          trendsRes.json(),
          performanceRes.json(),
        ]);

        setPortfolioMetrics(portfolio);
        setProperties(props);
        setFinancialMetrics(metrics);
        setMarketTrends(trends);
        setPerformance(perf);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading || !portfolioMetrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
              >
                Real Estate Portfolio Dashboard
              </motion.h1>
              <p className="text-slate-400 mt-1">AI-Powered Analytics & Predictive Insights</p>
            </div>
            <div className="flex items-center gap-4">
              <DateRangeSelector />
              <div className="text-right">
                <p className="text-sm text-slate-400">Last Updated</p>
                <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Portfolio Value"
            value={portfolioMetrics.totalValue / 1000000}
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            subtitle={`${portfolioMetrics.totalProperties} properties`}
            animated={true}
            prefix="$"
            suffix="M"
            decimals={2}
          />
          <MetricCard
            title="Annual Revenue"
            value={portfolioMetrics.totalRevenue / 1000000}
            change="+8.3%"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            subtitle={`$${(portfolioMetrics.totalRevenue / portfolioMetrics.totalProperties / 12).toFixed(0)}/property/month`}
            animated={true}
            prefix="$"
            suffix="M"
            decimals={2}
          />
          <MetricCard
            title="Occupancy Rate"
            value={portfolioMetrics.averageOccupancyRate * 100}
            change="+2.1%"
            trend="up"
            icon={<Users className="w-6 h-6" />}
            subtitle={`${Math.round(portfolioMetrics.totalProperties * portfolioMetrics.averageOccupancyRate)} occupied`}
            animated={true}
            suffix="%"
            decimals={1}
          />
          <MetricCard
            title="Average ROI"
            value={portfolioMetrics.averageROI}
            change="+0.8%"
            trend="up"
            icon={<BarChart3 className="w-6 h-6" />}
            subtitle={`${portfolioMetrics.averageCapRate.toFixed(2)}% cap rate`}
            animated={true}
            suffix="%"
            decimals={2}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={financialMetrics} />
          <OccupancyChart data={financialMetrics} />
        </div>

        {/* Charts Row 2 - Forecast & Cash Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ForecastChart data={financialMetrics} />
          <CashFlowChart data={financialMetrics} />
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MarketTrendsChart data={marketTrends} />
          <PropertyPerformanceChart data={performance.slice(0, 15)} />
        </div>

        {/* Portfolio Insights */}
        <div className="mb-8">
          <PortfolioInsights metrics={portfolioMetrics} properties={properties} />
        </div>

        {/* Price Segment Analysis */}
        <div className="mb-8">
          <PriceSegmentAnalysis properties={properties} />
        </div>

        {/* Access Rate Heatmap */}
        <div className="mb-8">
          <AccessRateHeatmap properties={properties} />
        </div>

        {/* Advanced Geospatial Map */}
        <div className="mb-8">
          <GeoSpatialMap properties={properties} />
        </div>

        {/* Geographic Distribution */}
        <div className="mb-8">
          <GeographicDistribution properties={properties} />
        </div>

        {/* Property Table */}
        <div className="mb-8">
          <PropertyTable 
            properties={properties} 
            onPropertyClick={(property) => {
              setSelectedProperty(property);
              setIsModalOpen(true);
            }}
          />
        </div>

        {/* Property Detail Modal */}
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-400 text-sm">
            Real Estate Portfolio Dashboard • Advanced Analytics Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

