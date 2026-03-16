import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PickupLocation } from '@/lib/models/PickupLocation';
import '@/lib/models/Venue';

type Params = { params: Promise<{ id: string }> };

// GET /api/pickup-locations/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const location = await PickupLocation.findById(id).populate('venue');
    if (!location) return NextResponse.json({ error: 'Pickup location não encontrado' }, { status: 404 });
    return NextResponse.json(location);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar pickup location' }, { status: 500 });
  }
}

// PUT /api/pickup-locations/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const location = await PickupLocation.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!location) return NextResponse.json({ error: 'Pickup location não encontrado' }, { status: 404 });
    return NextResponse.json(location);
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}

// DELETE /api/pickup-locations/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const location = await PickupLocation.findByIdAndDelete(id);
    if (!location) return NextResponse.json({ error: 'Pickup location não encontrado' }, { status: 404 });
    return NextResponse.json({ message: 'Pickup location removido com sucesso' });
  } catch {
    return NextResponse.json({ error: 'Erro ao remover pickup location' }, { status: 500 });
  }
}
