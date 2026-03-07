import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dojoId = searchParams.get("dojoId");
    const classId = searchParams.get("classId");

    const where: any = {};
    if (dojoId) where.dojoId = dojoId;
    if (classId) where.classId = classId;

    const checkIns = await prisma.checkIn.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, beltRank: true, stripes: true } },
        class: { select: { id: true, name: true, instructor: { select: { name: true } } } },
      },
      orderBy: { checkedInAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ checkIns });
  } catch (error) {
    console.error("Get check-ins error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { qrCode, dojoId, classId } = await request.json();

    if (!qrCode || !dojoId || !classId) {
      return NextResponse.json(
        { error: "Missing qrCode, dojoId, or classId" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { qrCode },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Invalid QR code" },
        { status: 404 }
      );
    }

    if (student.dojoId !== dojoId) {
      return NextResponse.json(
        { error: "Student not enrolled in this dojo" },
        { status: 403 }
      );
    }

    const classData = await prisma.class.findFirst({
      where: { id: classId, dojoId },
      include: { instructor: { select: { name: true } } },
    });

    if (!classData) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        studentId: student.id,
        dojoId,
        classId,
        method: "qr",
      },
    });

    await prisma.student.update({
      where: { id: student.id },
      data: { lastCheckIn: new Date() },
    });

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        beltRank: student.beltRank,
        stripes: student.stripes,
      },
      class: {
        name: classData.name,
        instructor: classData.instructor.name,
      },
      checkIn,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
