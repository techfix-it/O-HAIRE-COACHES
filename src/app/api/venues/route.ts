import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models/Venue';

// GET /api/venues
export async function GET() {
  try {
    await connectDB();
    const venues = await Venue.find().sort({ name: 1 });
    return NextResponse.json(venues);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar venues' }, { status: 500 });
  }
}

// POST /api/venues
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log(`[API] POST /venues body keys:`, Object.keys(body));
    
    const venue = await Venue.create({
      name: body.name,
      address: body.address,
      city: body.city,
      image: body.image
    });
    
    return NextResponse.json(venue, { status: 201 });
  } catch (error: any) {
    console.error("[API] POST Venue error:", error);
    return NextResponse.json({ error: error.message || 'Dados inválidos' }, { status: 400 });
  }
}
