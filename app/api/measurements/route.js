import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret_key";

// GET Customers & Measurements
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tailor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const customers = await prisma.customer.findMany({
      where: { tailorId: decoded.id },
      include: {
        measurements: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("GET Measurements Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers." }, { status: 500 });
  }
}

// POST Create or Update Customer & Measurements
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tailor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const body = await request.json();

    const { fullName, phone, email, notes, categoryName, details } = body;

    if (!fullName || !phone || !categoryName || !details) {
      return NextResponse.json(
        { error: "Full name, phone, category, and measurement details are required." },
        { status: 400 }
      );
    }

    // Upsert Customer (Find existing by phone or create new)
    const customer = await prisma.customer.upsert({
      where: {
        phone_tailorId: {
          phone: phone.trim(),
          tailorId: decoded.id,
        },
      },
      update: {
        fullName: fullName.trim(),
        email: email ? email.trim() : null,
        notes: notes ? notes.trim() : null,
      },
      create: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        notes: notes ? notes.trim() : null,
        tailorId: decoded.id,
      },
    });

    // Save Measurement Entry
    const measurement = await prisma.measurement.create({
      data: {
        categoryName,
        details, // JSON object of measurements
        customerId: customer.id,
      },
    });

    return NextResponse.json(
      { message: "Measurement recorded successfully!", customer, measurement },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Measurement Error:", error);
    return NextResponse.json({ error: "Failed to save measurement." }, { status: 500 });
  }
}