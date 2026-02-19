import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { qrCode, dojoId, classId } = await request.json();

    if (!qrCode || !dojoId || !classId) {
      return NextResponse.json(
        { error: "Missing qrCode, dojoId, or classId" },
        { status: 400 }
      );
    }

    // Find student by QR code
    const student = await prisma.student.findUnique({
      where: { qrCode },
      include: { dojo: true },
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

    // Verify class exists and belongs to dojo
    const classData = await prisma.class.findFirst({
      where: { id: classId, dojoId },
      include: { instructor: true },
    });

    if (!classData) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }

    // Create check-in with class
    const checkIn = await prisma.checkIn.create({
      data: {
        studentId: student.id,
        dojoId,
        classId,
        method: "qr",
      },
    });

    // Update student's last check-in
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
