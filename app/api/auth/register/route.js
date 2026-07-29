import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { businessName, email, password, phone, whatsapp } = body;

    // 1. Basic Validation
    if (!businessName || !email || !password || !whatsapp) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 2. Check if Email Already Exists
    const existingTailor = await prisma.tailor.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingTailor) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // 3. Generate Clean URL Slug from Business Name
    let baseSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/-+/g, '-');       // Collapse dashes

    if (!baseSlug) baseSlug = 'tailor';

    // Ensure Slug Uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.tailor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create Tailor Record
    const tailor = await prisma.tailor.create({
      data: {
        businessName,
        email: email.toLowerCase(),
        password: hashedPassword,
        slug,
        phone: phone || whatsapp,
        whatsapp,
        tagline: 'Custom Bespoke Tailoring & Fabrics',
      },
      select: {
        id: true,
        businessName: true,
        email: true,
        slug: true,
      },
    });

    // 6. Return Success Response
    const response = NextResponse.json(
      {
        message: 'Account created successfully!',
        tailor,
      },
      { status: 201 }
    );

    // Set simple cookie for session state
    response.cookies.set('tailor_id', tailor.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}