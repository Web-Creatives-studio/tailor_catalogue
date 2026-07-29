import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret_key';

// DELETE single dress listing
export async function DELETE(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const dressId = params.id;
    const cookieStore = await cookies();
    const token = cookieStore.get('tailor_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure the dress exists and belongs to the authenticated tailor
    const dress = await prisma.dress.findFirst({
      where: { id: dressId, tailorId: decoded.id },
    });

    if (!dress) {
      return NextResponse.json({ error: 'Dress not found or permission denied.' }, { status: 404 });
    }

    await prisma.dress.delete({
      where: { id: dressId },
    });

    return NextResponse.json({ message: 'Dress deleted successfully.' });
  } catch (error) {
    console.error('DELETE Dress Error:', error);
    return NextResponse.json({ error: 'Failed to delete dress.' }, { status: 500 });
  }
}

// PUT / UPDATE dress listing
export async function PUT(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const dressId = params.id;
    const cookieStore = await cookies();
    const token = cookieStore.get('tailor_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const body = await request.json();
    const { title, description, price, completionTime, categoryId, images } = body;

    if (!title || !categoryId) {
      return NextResponse.json({ error: 'Title and category are required.' }, { status: 400 });
    }

    // Verify ownership
    const existingDress = await prisma.dress.findFirst({
      where: { id: dressId, tailorId: decoded.id },
    });

    if (!existingDress) {
      return NextResponse.json({ error: 'Dress not found or permission denied.' }, { status: 404 });
    }

    const updatedDress = await prisma.dress.update({
      where: { id: dressId },
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        price: price ? parseFloat(price) : null,
        completionTime: completionTime ? completionTime.trim() : null,
        categoryId,
        images: images && images.length > 0 ? images : existingDress.images,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      message: 'Dress updated successfully!',
      dress: updatedDress,
    });
  } catch (error) {
    console.error('PUT Dress Error:', error);
    return NextResponse.json({ error: 'Failed to update dress.' }, { status: 500 });
  }
}