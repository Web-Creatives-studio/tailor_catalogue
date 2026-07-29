import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const dressId = params.id;

    if (!dressId) {
      return NextResponse.json(
        { error: "Dress ID is required." },
        { status: 400 }
      );
    }

    // Fetch dress with category name and tailor WhatsApp number
    const dress = await prisma.dress.findUnique({
      where: { id: dressId },
      include: {
        category: {
          select: { name: true },
        },
        tailor: {
          select: {
            businessName: true,
            whatsapp: true,
            slug: true,
          },
        },
      },
    });

    if (!dress) {
      return NextResponse.json(
        { error: "Dress details not found." },
        { status: 404 }
      );
    }

    // Increment view count for the dress
    await prisma.dress.update({
      where: { id: dress.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      dress: {
        id: dress.id,
        title: dress.title,
        category: dress.category?.name || "General",
        price: dress.price || 0,
        description:
          dress.description || "Bespoke custom outfit crafted to perfection.",
        completionTime: dress.completionTime || "5 - 7 working days",
        whatsapp: dress.tailor?.whatsapp || "",
        tailorName: dress.tailor?.businessName || "",
        slug: dress.tailor?.slug || "",
        images:
          dress.images && dress.images.length > 0
            ? dress.images
            : ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1000"],
      },
    });
  } catch (error) {
    console.error("Fetch Single Dress Error:", error);
    return NextResponse.json(
      { error: "Failed to load dress details." },
      { status: 500 }
    );
  }
}