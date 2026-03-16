import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { BusRoute } from '@/lib/models/BusRoute';
import '@/lib/models/PickupLocation';

type Params = { params: Promise<{ eventId: string }> };

// GET /api/bus-routes/event/:eventId
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { eventId } = await params;
    await connectDB();
    const routes = await BusRoute.find({ event: eventId })
      .populate('pickupLocation', 'name description');
    return NextResponse.json(routes);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar rotas do evento' }, { status: 500 });
  }
}
