// Static data generation for GitHub Pages deployment
// Since GitHub Pages doesn't support API routes, we generate data client-side

import { generateProperties, generateFinancialMetrics, generateMarketTrends, calculatePortfolioMetrics, generatePropertyPerformance } from './data-generator';

// Cache data generation
let cachedProperties: any = null;
let cachedMetrics: any = null;
let cachedTrends: any = null;
let cachedPortfolio: any = null;
let cachedPerformance: any = null;

export function getProperties() {
  if (!cachedProperties) {
    cachedProperties = generateProperties(150);
  }
  return cachedProperties;
}

export function getFinancialMetrics() {
  if (!cachedMetrics) {
    cachedMetrics = generateFinancialMetrics(24);
  }
  return cachedMetrics;
}

export function getMarketTrends() {
  if (!cachedTrends) {
    cachedTrends = generateMarketTrends(36);
  }
  return cachedTrends;
}

export function getPortfolioMetrics() {
  if (!cachedPortfolio) {
    const properties = getProperties();
    cachedPortfolio = calculatePortfolioMetrics(properties);
  }
  return cachedPortfolio;
}

export function getPropertyPerformance() {
  if (!cachedPerformance) {
    const properties = getProperties();
    cachedPerformance = generatePropertyPerformance(properties);
  }
  return cachedPerformance;
}

