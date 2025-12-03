'use client';

import { Property } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Home, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  if (!property) return null;

  const annualRevenue = property.monthlyRent * 12 * property.occupancyRate;
  const annualExpenses = property.currentValue * 0.03;
  const netIncome = annualRevenue - annualExpenses;
  const appreciation = ((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{property.address}</h2>
                  <p className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Home className="w-4 h-4" />
                      <span className="text-xs">Type</span>
                    </div>
                    <p className="text-white font-semibold">{property.propertyType}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <span className="text-xs">Bedrooms</span>
                    </div>
                    <p className="text-white font-semibold">{property.bedrooms}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <span className="text-xs">Bathrooms</span>
                    </div>
                    <p className="text-white font-semibold">{property.bathrooms}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <span className="text-xs">Square Feet</span>
                    </div>
                    <p className="text-white font-semibold">{property.squareFeet.toLocaleString()}</p>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary-400" />
                    Financial Performance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Annual Revenue</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${(annualRevenue / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Annual Expenses</p>
                      <p className="text-2xl font-bold text-red-400">
                        ${(annualExpenses / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Net Income</p>
                      <p className="text-2xl font-bold text-blue-400">
                        ${(netIncome / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                </div>

                {/* Investment Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-400" />
                    Investment Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Purchase Price</p>
                      <p className="text-white font-semibold">${(property.purchasePrice / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Current Value</p>
                      <p className="text-white font-semibold">${(property.currentValue / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">ROI</p>
                      <p className={`font-semibold ${property.roi > 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {property.roi.toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-1">Cap Rate</p>
                      <p className="text-white font-semibold">{property.capRate.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Occupancy</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{(property.occupancyRate * 100).toFixed(0)}%</span>
                          <span className="text-slate-400">{property.occupancyStatus}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${property.occupancyRate * 100}%` }}
                            className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Property Info</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Year Built</span>
                        <span className="text-white">{property.yearBuilt}</span>
                      </div>
                      {property.lastRenovation && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Renovation</span>
                          <span className="text-white">{property.lastRenovation}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Appreciation</span>
                        <span className="text-green-400 font-semibold">+{appreciation.toFixed(1)}%</span>
                      </div>
                      {property.tenantRating && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tenant Rating</span>
                          <span className="text-yellow-400 font-semibold">{property.tenantRating.toFixed(1)}/5.0</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

