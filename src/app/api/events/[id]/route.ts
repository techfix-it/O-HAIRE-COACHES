import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Event } from '@/lib/models/Event';
import mongoose from 'mongoose';
import '@/lib/models/Venue';
import '@/lib/models/BusRoute';
import '@/lib/models/PickupLocation';

type Params = { params: Promise<{ id: string }> };

// GET /api/events/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const event = await Event.findById(id)
      .populate('venue')
      .populate({
        path: 'routes',
        populate: { path: 'pickupLocation' }
      });
    if (!event) return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar evento' }, { status: 500 });
  }
}

// PUT /api/events/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const event = await Event.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!event) return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}

// DELETE /api/events/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const event = await Event.findByIdAndDelete(id);
    if (!event) return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    return NextResponse.json({ message: 'Evento removido com sucesso' });
  } catch {
    return NextResponse.json({ error: 'Erro ao remover evento' }, { status: 500 });
  }
}
