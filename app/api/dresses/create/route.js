import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret_key';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tailor_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const body = await request.json();

    const { title, description, price, completionTime, categoryId, images } = body;

    if (!title || !categoryId || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a title, category, and at least 1 image URL.' },
        { status: 400 }
      );
    }

    if (images.length > 4) {
      return NextResponse.json(
        { error: 'You can upload a maximum of 4 images per dress.' },
        { status: 400 }
      );
    }

    const dress = await prisma.dress.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        price: price ? parseFloat(price) : null,
        completionTime: completionTime ? completionTime.trim() : null,
        images,
        categoryId,
        tailorId: decoded.id,
      },
    });

    return NextResponse.json({ dress, message: 'Dress created successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Create Dress Error:', error);
    return NextResponse.json({ error: 'Failed to create dress.' }, { status: 500 });
  }
}