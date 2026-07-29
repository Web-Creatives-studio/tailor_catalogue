import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret_key";

// GET Profile Details
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tailor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const tailor = await prisma.tailor.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        businessName: true,
        email: true,
        slug: true,
        tagline: true,
        bio: true,
        phone: true,
        whatsapp: true,
        location: true,
        logoUrl: true,
        heroBgUrl: true,
        createdAt: true,
      },
    });

    if (!tailor) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    return NextResponse.json({ tailor });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

// PUT Update Profile Details
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tailor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const body = await request.json();

    const {
      businessName,
      tagline,
      bio,
      phone,
      whatsapp,
      location,
      logoUrl,
      heroBgUrl,
    } = body;

    if (!businessName || !businessName.trim()) {
      return NextResponse.json(
        { error: "Business name cannot be empty." },
        { status: 400 }
      );
    }

    // Update Tailor Record
    const updatedTailor = await prisma.tailor.update({
      where: { id: decoded.id },
      data: {
        businessName: businessName.trim(),
        tagline: tagline ? tagline.trim() : null,
        bio: bio ? bio.trim() : null,
        phone: phone ? phone.trim() : "",
        whatsapp: whatsapp ? whatsapp.trim() : "",
        location: location ? location.trim() : null,
        logoUrl: logoUrl || null,
        heroBgUrl: heroBgUrl || null,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully!",
      tailor: updatedTailor,
    });
  } catch (error) {
    console.error("PUT Profile Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile information." },
      { status: 500 }
    );
  }
}