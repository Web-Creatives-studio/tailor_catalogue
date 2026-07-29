import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret_key';

export async function DELETE(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const measurementId = params.id;
    const cookieStore = await cookies();
    const token = cookieStore.get('tailor_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify measurement belongs to a customer owned by this tailor
    const measurement = await prisma.measurement.findFirst({
      where: {
        id: measurementId,
        customer: {
          tailorId: decoded.id,
        },
      },
    });

    if (!measurement) {
      return NextResponse.json(
        { error: 'Measurement record not found or permission denied.' },
        { status: 404 }
      );
    }

    await prisma.measurement.delete({
      where: { id: measurementId },
    });

    return NextResponse.json({ message: 'Measurement record deleted successfully.' });
  } catch (error) {
    console.error('DELETE Measurement Error:', error);
    return NextResponse.json({ error: 'Failed to delete measurement record.' }, { status: 500 });
  }
}

export async function PUT(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const measurementId = params.id;
    const cookieStore = await cookies();
    const token = cookieStore.get("tailor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const body = await request.json();

    const { fullName, phone, email, notes, categoryName, details } = body;

    // Verify measurement belongs to a customer owned by this tailor
    const existingMeasurement = await prisma.measurement.findFirst({
      where: {
        id: measurementId,
        customer: {
          tailorId: decoded.id,
        },
      },
      include: {
        customer: true,
      },
    });

    if (!existingMeasurement) {
      return NextResponse.json(
        { error: "Measurement record not found or permission denied." },
        { status: 404 }
      );
    }

    // 1. Update Customer personal details if provided
    await prisma.customer.update({
      where: { id: existingMeasurement.customerId },
      data: {
        fullName: fullName ? fullName.trim() : existingMeasurement.customer.fullName,
        phone: phone ? phone.trim() : existingMeasurement.customer.phone,
        email: email ? email.trim() : existingMeasurement.customer.email,
        notes: notes ? notes.trim() : existingMeasurement.customer.notes,
      },
    });

    // 2. Update Measurement category name & parameters JSON
    const updatedMeasurement = await prisma.measurement.update({
      where: { id: measurementId },
      data: {
        categoryName: categoryName || existingMeasurement.categoryName,
        details: details || existingMeasurement.details,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json({
      message: "Measurement record updated successfully!",
      measurement: updatedMeasurement,
    });
  } catch (error) {
    console.error("PUT Measurement Error:", error);
    return NextResponse.json(
      { error: "Failed to update measurement record." },
      { status: 500 }
    );
  }
}