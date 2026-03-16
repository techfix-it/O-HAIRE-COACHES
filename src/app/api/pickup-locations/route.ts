import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PickupLocation } from '@/lib/models/PickupLocation';
import '@/lib/models/Venue';

// GET /api/pickup-locations
export async function GET() {
  try {
    await connectDB();
    const locations = await PickupLocation.find().populate('venue').sort({ name: 1 });
    return NextResponse.json(locations);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar pickup locations' }, { status: 500 });
  }
}

// POST /api/pickup-locations
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const location = await PickupLocation.create(body);
    return NextResponse.json(location, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}
