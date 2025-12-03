import { NextResponse } from 'next/server';
import { generateMarketTrends } from '@/lib/data-generator';

export async function GET() {
  const trends = generateMarketTrends(36);
  return NextResponse.json(trends);
}

