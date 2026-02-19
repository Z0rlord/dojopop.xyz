import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dojoId = searchParams.get("dojoId");

    const where = dojoId ? { dojoId } : {};

    const instructors = await prisma.instructor.findMany({
      where,
      select: { id: true, name: true, email: true, isAdmin: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ instructors });
  } catch (error) {
    console.error("Get instructors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, isAdmin, dojoId } = await request.json();

    if (!name || !email || !password || !dojoId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const instructor = await prisma.instructor.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
        dojoId,
      },
      select: { id: true, name: true, email: true, isAdmin: true },
    });

    return NextResponse.json({
      success: true,
      instructor,
    });
  } catch (error) {
    console.error("Create instructor error:", error);
    
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create instructor" },
      { status: 500 }
    );
  }
}
