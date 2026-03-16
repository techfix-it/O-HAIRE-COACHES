import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Event } from '@/lib/models/Event';
import '@/lib/models/Venue';
import '@/lib/models/BusRoute';
import '@/lib/models/PickupLocation';

// GET /api/events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find()
      .populate('venue')
      .populate({
        path: 'routes',
        populate: { path: 'pickupLocation' }
      })
      .sort({ date: 1 });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const event = await Event.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}
