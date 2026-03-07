import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { nfcId, dojoId, classId, studentId } = await request.json();

    if (!dojoId || !classId) {
      return NextResponse.json(
        { error: "dojoId and classId required" },
        { status: 400 }
      );
    }

    let student;

    // Option 1: Direct student ID (NFC contains student ID)
    if (studentId) {
      student = await prisma.student.findUnique({
        where: { id: studentId },
      });
    }
    // Option 2: NFC tag ID mapped to student
    else if (nfcId) {
      // For now, treat NFC ID as QR code
      student = await prisma.student.findFirst({
        where: { qrCode: nfcId },
      });
    }

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
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
        classId,
        method: "nfc",
      },
    });

    // Update last check-in
    await prisma.student.update({
      where: { id: student.id },
      data: { lastCheckIn: new Date() },
    });

    // Award token
    await prisma.$transaction([
      prisma.tokenTransaction.create({
        data: {
          studentId: student.id,
          amount: 1,
          type: "CHECK_IN",
          description: "NFC check-in",
          relatedId: checkIn.id,
        },
      }),
      prisma.student.update({
        where: { id: student.id },
        data: {
          dojoBalance: { increment: 1 },
          totalEarned: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        beltRank: student.beltRank,
        stripes: student.stripes,
      },
      checkIn,
      tokensAwarded: 1,
    });
  } catch (error) {
    console.error("NFC check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
