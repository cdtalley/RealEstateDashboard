import { NextResponse } from 'next/server';
import { generateProperties } from '@/lib/data-generator';

export async function GET() {
  const properties = generateProperties(150);
  return NextResponse.json(properties);
}

