import { Property, FinancialMetric, MarketTrend, PortfolioMetrics, PropertyPerformance } from './types';
import { subMonths, format } from 'date-fns';

const cities = [
  { name: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 },
  { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { name: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
  { name: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
  { name: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 },
  { name: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  { name: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589 },
  { name: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784 },
];

const propertyTypes: Property['propertyType'][] = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial'];
const streetNames = ['Main St', 'Oak Ave', 'Elm St', 'Park Blvd', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Washington Ave'];
const occupancyStatuses: Property['occupancyStatus'][] = ['Occupied', 'Vacant', 'Maintenance'];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

export function generateProperties(count: number = 150): Property[] {
  const properties: Property[] = [];
  
  for (let i = 0; i < count; i++) {
    const city = randomElement(cities);
    const propertyType = randomElement(propertyTypes);
    const streetNum = randomInt(100, 9999);
    const streetName = randomElement(streetNames);
    
    const bedrooms = propertyType === 'Commercial' ? 0 : randomInt(1, propertyType === 'Multi-Family' ? 6 : 4);
    const bathrooms = propertyType === 'Commercial' ? randomInt(1, 4) : randomInt(1, bedrooms + 1);
    const squareFeet = propertyType === 'Commercial' 
      ? randomInt(1000, 5000) 
      : randomInt(800, 3500);
    
    const yearBuilt = randomInt(1950, 2023);
    const basePrice = squareFeet * randomBetween(200, 600);
    const purchasePrice = basePrice * randomBetween(0.7, 1.0);
    const currentValue = basePrice * randomBetween(1.0, 1.4);
    const monthlyRent = currentValue * randomBetween(0.005, 0.012);
    
    const occupancyStatus = randomElement(occupancyStatuses);
    const occupancyRate = occupancyStatus === 'Occupied' 
      ? randomBetween(0.85, 1.0) 
      : occupancyStatus === 'Vacant' 
      ? randomBetween(0, 0.15) 
      : randomBetween(0.5, 0.85);
    
    const annualRent = monthlyRent * 12 * occupancyRate;
    const annualExpenses = currentValue * randomBetween(0.02, 0.04);
    const netIncome = annualRent - annualExpenses;
    const roi = (netIncome / purchasePrice) * 100;
    const capRate = (netIncome / currentValue) * 100;
    
    properties.push({
      id: `PROP-${String(i + 1).padStart(4, '0')}`,
      address: `${streetNum} ${streetName}`,
      city: city.name,
      state: city.state,
      zipCode: String(randomInt(10000, 99999)),
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      yearBuilt,
      purchasePrice: Math.round(purchasePrice),
      currentValue: Math.round(currentValue),
      monthlyRent: Math.round(monthlyRent),
      occupancyStatus,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      capRate: Math.round(capRate * 100) / 100,
      latitude: city.lat + randomBetween(-0.1, 0.1),
      longitude: city.lng + randomBetween(-0.1, 0.1),
      lastRenovation: Math.random() > 0.5 ? randomInt(yearBuilt, 2023) : undefined,
      tenantRating: occupancyStatus === 'Occupied' ? randomBetween(3.5, 5.0) : undefined,
    });
  }
  
  return properties;
}

export function generateFinancialMetrics(months: number = 24): FinancialMetric[] {
  const metrics: FinancialMetric[] = [];
  const baseRevenue = 2500000;
  const baseExpenses = 800000;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const trend = Math.sin((months - i) / 12 * Math.PI * 2) * 0.1 + 1;
    const seasonalFactor = Math.sin((date.getMonth() / 12) * Math.PI * 2 - Math.PI / 2) * 0.15 + 1;
    
    const revenue = baseRevenue * trend * seasonalFactor * randomBetween(0.95, 1.05);
    const expenses = baseExpenses * trend * randomBetween(0.92, 1.08);
    const netIncome = revenue - expenses;
    const occupancyRate = randomBetween(0.88, 0.96);
    const averageRent = 2500 * trend * randomBetween(0.98, 1.02);
    const propertyCount = 150 + Math.floor((months - i) / 3);
    
    metrics.push({
      date: format(date, 'yyyy-MM-dd'),
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      netIncome: Math.round(netIncome),
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      averageRent: Math.round(averageRent),
      propertyCount,
    });
  }
  
  return metrics;
}

export function generateMarketTrends(months: number = 36): MarketTrend[] {
  const trends: MarketTrend[] = [];
  const basePrice = 450000;
  const baseRent = 2800;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const growthFactor = 1 + (months - i) * 0.003;
    const volatility = randomBetween(0.95, 1.05);
    
    trends.push({
      month: format(date, 'MMM yyyy'),
      averagePrice: Math.round(basePrice * growthFactor * volatility),
      averageRent: Math.round(baseRent * growthFactor * volatility * randomBetween(0.98, 1.02)),
      salesVolume: randomInt(15, 45),
      daysOnMarket: randomInt(18, 45),
      pricePerSqFt: Math.round((basePrice * growthFactor * volatility) / 200),
    });
  }
  
  return trends;
}

export function calculatePortfolioMetrics(properties: Property[]): PortfolioMetrics {
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalRevenue = properties.reduce((sum, p) => sum + p.monthlyRent * 12 * p.occupancyRate, 0);
  const totalExpenses = properties.reduce((sum, p) => sum + p.currentValue * 0.03, 0);
  const netIncome = totalRevenue - totalExpenses;
  const averageOccupancyRate = properties.reduce((sum, p) => sum + p.occupancyRate, 0) / totalProperties;
  const averageROI = properties.reduce((sum, p) => sum + p.roi, 0) / totalProperties;
  const averageCapRate = properties.reduce((sum, p) => sum + p.capRate, 0) / totalProperties;
  const totalSquareFeet = properties.reduce((sum, p) => sum + p.squareFeet, 0);
  
  return {
    totalProperties,
    totalValue: Math.round(totalValue),
    totalRevenue: Math.round(totalRevenue),
    totalExpenses: Math.round(totalExpenses),
    netIncome: Math.round(netIncome),
    averageOccupancyRate: Math.round(averageOccupancyRate * 100) / 100,
    averageROI: Math.round(averageROI * 100) / 100,
    averageCapRate: Math.round(averageCapRate * 100) / 100,
    totalSquareFeet: Math.round(totalSquareFeet),
  };
}

export function generatePropertyPerformance(properties: Property[]): PropertyPerformance[] {
  return properties.map(p => {
    const annualRevenue = p.monthlyRent * 12 * p.occupancyRate;
    const annualExpenses = p.currentValue * 0.03;
    const netIncome = annualRevenue - annualExpenses;
    
    return {
      propertyId: p.id,
      propertyName: `${p.address}, ${p.city}`,
      revenue: Math.round(annualRevenue),
      expenses: Math.round(annualExpenses),
      netIncome: Math.round(netIncome),
      occupancyRate: p.occupancyRate,
      roi: p.roi,
    };
  }).sort((a, b) => b.netIncome - a.netIncome);
}

