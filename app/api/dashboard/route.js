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
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const tailorId = decoded.id;

    // Fetch Tailor details with categories and dresses count
    const tailor = await prisma.Tailor.findUnique({
      where: { id: tailorId },
      include: {
        categories: {
          include: {
            _count: {
              select: { dresses: true },
            },
          },
        },
        _count: {
          select: {
            dresses: true,
            categories: true,
          },
        },
      },
    });

    if (!tailor) {
      return NextResponse.json({ error: 'Tailor account not found.' }, { status: 404 });
    }

    // Format category chart data
    const categoryStats = tailor.categories.map((cat) => ({
      name: cat.name,
      count: cat._count.dresses,
    }));

    return NextResponse.json({
      tailor: {
        id: tailor.id,
        businessName: tailor.businessName,
        slug: tailor.slug,
        views: tailor.views,
        totalDresses: tailor._count.dresses,
        categoriesCount: tailor._count.categories,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics.' }, { status: 500 });
  }
}