import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret_key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tailor_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const dresses = await prisma.dress.findMany({
      where: { tailorId: decoded.id },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ dresses });
  } catch (error) {
    console.error('Dresses API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dresses.' }, { status: 500 });
  }
}