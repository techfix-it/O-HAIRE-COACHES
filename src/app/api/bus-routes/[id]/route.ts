import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { BusRoute } from '@/lib/models/BusRoute';
import '@/lib/models/Event';
import '@/lib/models/PickupLocation';

type Params = { params: Promise<{ id: string }> };

// GET /api/bus-routes/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const route = await BusRoute.findById(id)
      .populate('event', 'title date')
      .populate('pickupLocation', 'name description');
    if (!route) return NextResponse.json({ error: 'Rota não encontrada' }, { status: 404 });
    return NextResponse.json(route);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar rota' }, { status: 500 });
  }
}

// PUT /api/bus-routes/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const route = await BusRoute.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!route) return NextResponse.json({ error: 'Rota não encontrada' }, { status: 404 });
    return NextResponse.json(route);
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}

// DELETE /api/bus-routes/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const route = await BusRoute.findByIdAndDelete(id);
    if (!route) return NextResponse.json({ error: 'Rota não encontrada' }, { status: 404 });
    return NextResponse.json({ message: 'Rota removida com sucesso' });
  } catch {
    return NextResponse.json({ error: 'Erro ao remover rota' }, { status: 500 });
  }
}
