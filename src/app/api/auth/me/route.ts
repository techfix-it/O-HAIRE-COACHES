import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { User } from '@/lib/models/User';
import { connectDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAuth(req);
    
    if (!session) {
      return NextResponse.json({ user: null });
    }
    
    await connectDB();
    const user = await User.findById(session.userId).select('name email role phone address createdAt');
    
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAuth(req);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { name, phone, address } = await req.json();
    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      { 
        $set: { 
          name, 
          phone, 
          address 
        } 
      },
      { new: true, runValidators: true }
    ).select('name email role phone address createdAt');

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAuth(req);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findByIdAndDelete(session.userId);

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Clear session cookie
    const response = NextResponse.json({ message: 'Conta excluída com sucesso' });
    response.cookies.set('auth-token', '', { expires: new Date(0) });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir conta' }, { status: 500 });
  }
}
