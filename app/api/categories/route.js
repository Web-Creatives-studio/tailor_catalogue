import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret_key';

// GET all categories for logged in tailor
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tailor_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const categories = await prisma.category.findMany({
      where: { tailorId: decoded.id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

// POST create new category
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tailor_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const cleanName = name.trim();

    // Check duplicate
    const existing = await prisma.category.findFirst({
      where: {
        tailorId: decoded.id,
        name: { equals: cleanName, mode: 'insensitive' },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Category already exists.' }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name: cleanName,
        tailorId: decoded.id,
      },
    });

    return NextResponse.json({ category, message: 'Category created successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Create Category Error:', error);
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
  }
}