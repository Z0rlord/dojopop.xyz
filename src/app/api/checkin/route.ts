import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { qrCode, dojoId } = await request.json();

    if (!qrCode || !dojoId) {
      return NextResponse.json(
        { error: "Missing qrCode or dojoId" },
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

    // Create check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        studentId: student.id,
        dojoId,
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
