import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { BusRoute } from '@/lib/models/BusRoute';
import '@/lib/models/Event';
import '@/lib/models/PickupLocation';

// GET /api/bus-routes
export async function GET() {
  try {
    await connectDB();
    const routes = await BusRoute.find()
      .populate('event', 'title date')
      .populate('pickupLocation', 'name description');
    return NextResponse.json(routes);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar rotas' }, { status: 500 });
  }
}

// POST /api/bus-routes
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const route = await BusRoute.create(body);
    return NextResponse.json(route, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}
