import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, dojoId } = await request.json();

    if (!name || !dojoId) {
      return NextResponse.json(
        { error: "Name and dojo are required" },
        { status: 400 }
      );
    }

    // Generate unique QR code
    const qrCode = crypto.randomUUID();

    const student = await prisma.student.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        dojoId,
        qrCode,
        beltRank: "WHITE",
        stripes: 0,
      },
    });

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        qrCode: student.qrCode,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
