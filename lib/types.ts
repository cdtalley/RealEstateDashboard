export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Commercial';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  purchasePrice: number;
  currentValue: number;
  monthlyRent: number;
  occupancyStatus: 'Occupied' | 'Vacant' | 'Maintenance';
  occupancyRate: number;
  roi: number;
  capRate: number;
  latitude: number;
  longitude: number;
  lastRenovation?: number;
  tenantRating?: number;
}

export interface FinancialMetric {
  date: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  occupancyRate: number;
  averageRent: number;
  propertyCount: number;
}

export interface MarketTrend {
  month: string;
  averagePrice: number;
  averageRent: number;
  salesVolume: number;
  daysOnMarket: number;
  pricePerSqFt: number;
}

export interface PortfolioMetrics {
  totalProperties: number;
  totalValue: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  averageOccupancyRate: number;
  averageROI: number;
  averageCapRate: number;
  totalSquareFeet: number;
}

export interface PropertyPerformance {
  propertyId: string;
  propertyName: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  occupancyRate: number;
  roi: number;
}

