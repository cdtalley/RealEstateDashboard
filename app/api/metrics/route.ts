import { NextResponse } from 'next/server';
import { generateFinancialMetrics } from '@/lib/data-generator';

export async function GET() {
  const metrics = generateFinancialMetrics(24);
  return NextResponse.json(metrics);
}

