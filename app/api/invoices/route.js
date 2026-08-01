import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret_key";

// GET Handler - Fetch all invoices for the authenticated tailor
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tailor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const invoices = await prisma.invoice.findMany({
      where: { tailorId: decoded.id },
      include: {
        customer: {
          select: { fullName: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch (err) {
    console.error("GET Invoices Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST Handler - Create new invoice
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tailor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const body = await request.json();

    const {
      customerId,
      docType,
      itemTitle,
      category,
      quantity,
      unitPrice,
      totalAmount,
      depositPaid,
      balanceDue,
    } = body;

    if (!customerId || !itemTitle || totalAmount === undefined) {
      return NextResponse.json(
        { error: "Missing required invoice details." },
        { status: 400 }
      );
    }

    let status = "UNPAID";
    if (balanceDue <= 0) {
      status = "PAID";
    } else if (depositPaid > 0) {
      status = "PARTIAL";
    }

    const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        docType: docType || "INVOICE",
        itemTitle,
        category: category || "General",
        quantity: Number(quantity) || 1,
        unitPrice: Number(unitPrice) || 0,
        totalAmount: Number(totalAmount) || 0,
        depositPaid: Number(depositPaid) || 0,
        balanceDue: Number(balanceDue) || 0,
        status,
        customerId,
        tailorId: decoded.id,
      },
      include: {
        customer: {
          select: { fullName: true, phone: true },
        },
      },
    });

    return NextResponse.json({
      message: "Invoice recorded successfully!",
      invoice: newInvoice,
    });
  } catch (err) {
    console.error("Failed to create invoice:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}