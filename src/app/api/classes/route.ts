import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dojoId = searchParams.get("dojoId");

    const where = dojoId ? { dojoId } : {};

    const classes = await prisma.class.findMany({
      where,
      include: { instructor: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Get classes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, schedule, instructorId, dojoId, maxStudents } = await request.json();

    if (!name || !schedule || !instructorId || !dojoId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        schedule,
        instructorId,
        dojoId,
        maxStudents: maxStudents || 30,
      },
      include: { instructor: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      success: true,
      class: newClass,
    });
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}
