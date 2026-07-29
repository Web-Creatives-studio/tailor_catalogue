import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret_key';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Basic Input Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    // 2. Find Tailor in PostgreSQL DB
    const tailor = await prisma.Tailor.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!tailor) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 3. Verify Password Match
    const passwordMatch = await bcrypt.compare(password, tailor.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 4. Generate JWT Session Token
    const token = jwt.sign(
      {
        id: tailor.id,
        email: tailor.email,
        slug: tailor.slug,
        businessName: tailor.businessName,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Build Response Object
    const response = NextResponse.json(
      {
        message: 'Login successful!',
        tailor: {
          id: tailor.id,
          businessName: tailor.businessName,
          email: tailor.email,
          slug: tailor.slug,
        },
      },
      { status: 200 }
    );

    // 6. Attach HTTP-Only Auth Cookie
    response.cookies.set('tailor_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}