import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { error: "Tailor slug is required." },
        { status: 400 }
      );
    }

    // 1. Fetch tailor, categories, and associated dresses from database
    const tailor = await prisma.tailor.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
          },
          orderBy: { name: "asc" },
        },
        dresses: {
          include: {
            category: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!tailor) {
      return NextResponse.json(
        { error: "Tailor catalogue not found." },
        { status: 404 }
      );
    }

    // 2. Increment view count asynchronously
    await prisma.tailor.update({
      where: { id: tailor.id },
      data: { views: { increment: 1 } },
    });

    // 3. Format response for frontend consumption
    const formattedCategories = [
      "All",
      ...tailor.categories.map((cat) => cat.name),
    ];

    const formattedDresses = tailor.dresses.map((dress) => ({
      id: dress.id,
      title: dress.title,
      category: dress.category?.name || "General",
      price: dress.price,
      completionTime: dress.completionTime,
      description: dress.description,
      images:
        dress.images && dress.images.length > 0
          ? dress.images
          : ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600"],
    }));

    return NextResponse.json({
      tailor: {
        id: tailor.id,
        businessName: tailor.businessName,
        slug: tailor.slug,
        logoUrl: tailor.logoUrl || "",
        heroBgUrl:
          tailor.heroBgUrl ||
          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
        tagline: tailor.tagline || "Bespoke Fashion & Custom Designs",
        bio: tailor.bio || "Custom tailoring crafted to your exact fit.",
        location: tailor.location || "",
        whatsapp: tailor.whatsapp,
        phone: tailor.phone,
        categories: formattedCategories,
        dresses: formattedDresses,
      },
    });
  } catch (error) {
    console.error("Fetch Public Catalogue Error:", error);
    return NextResponse.json(
      { error: "Failed to load catalogue." },
      { status: 500 }
    );
  }
}