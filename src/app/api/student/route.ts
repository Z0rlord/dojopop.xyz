import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dojoId = searchParams.get("dojoId");

    const where = dojoId ? { dojoId } : {};

    const students = await prisma.student.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, dojoId } = await request.json();

    if (!name || !dojoId) {
      return NextResponse.json(
        { error: "Name and dojo are required" },
        { status: 400 }
      );
    }

    const qrCode = crypto.randomUUID();

    const student = await prisma.student.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        dojoId,
        qrCode,
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
