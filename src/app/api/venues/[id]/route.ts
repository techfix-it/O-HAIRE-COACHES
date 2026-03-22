import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models/Venue';

type Params = { params: Promise<{ id: string }> };

// GET /api/venues/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const venue = await Venue.findById(id);
    if (!venue) return NextResponse.json({ error: 'Venue não encontrado' }, { status: 404 });
    return NextResponse.json(venue);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar venue' }, { status: 500 });
  }
}

// PUT /api/venues/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    console.log(`[API] PUT /venues/${id} body keys:`, Object.keys(body));
    
    const venue = await Venue.findByIdAndUpdate(
      id, 
      {
        name: body.name,
        address: body.address,
        city: body.city,
        image: body.image
      }, 
      { new: true, runValidators: true }
    );
    
    if (!venue) return NextResponse.json({ error: 'Venue não encontrado' }, { status: 404 });
    return NextResponse.json(venue);
  } catch (error: any) {
    console.error("[API] PUT Venue error:", error);
    return NextResponse.json({ error: error.message || 'Dados inválidos' }, { status: 400 });
  }
}

// DELETE /api/venues/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const venue = await Venue.findByIdAndDelete(id);
    if (!venue) return NextResponse.json({ error: 'Venue não encontrado' }, { status: 404 });
    return NextResponse.json({ message: 'Venue removido com sucesso' });
  } catch {
    return NextResponse.json({ error: 'Erro ao remover venue' }, { status: 500 });
  }
}
