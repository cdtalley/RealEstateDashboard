import { NextResponse } from 'next/server';
import { generateProperties, calculatePortfolioMetrics } from '@/lib/data-generator';

export async function GET() {
  const properties = generateProperties(150);
  const metrics = calculatePortfolioMetrics(properties);
  return NextResponse.json(metrics);
}

