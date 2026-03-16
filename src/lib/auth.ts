import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export async function verifyAuth(req: NextRequest): Promise<JwtPayload | null> {
  const token = req.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    // Using jsonwebtoken library here. Since API Routes in Next.js App Router
    // run in the Node.js runtime by default (unless marked as edge), this works fine.
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyAdmin(req: NextRequest): Promise<JwtPayload | null> {
  const session = await verifyAuth(req);
  
  if (!session || session.role !== 'ADMIN') {
    return null;
  }
  
  return session;
}
