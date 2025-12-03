import { NextResponse } from 'next/server';
import { generateProperties, generatePropertyPerformance } from '@/lib/data-generator';

export async function GET() {
  const properties = generateProperties(150);
  const performance = generatePropertyPerformance(properties);
  return NextResponse.json(performance);
}

