import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, qrCode, method, timestamp, classId } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // If QR code provided, verify it matches
    if (qrCode && qrCode !== student.qrCode) {
      return NextResponse.json(
        { error: "Invalid QR code" },
        { status: 401 }
      );
    }

    // Get or create a default class for this dojo
    let targetClassId = classId;
    if (!targetClassId) {
      const defaultClass = await prisma.class.findFirst({
        where: { dojoId: student.dojoId },
      });
      if (!defaultClass) {
        return NextResponse.json(
          { error: "No class found for this dojo" },
          { status: 400 }
        );
      }
      targetClassId = defaultClass.id;
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        studentId,
        checkedInAt: {
          gte: today,
        },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: "Already checked in today", checkIn: existingCheckIn },
        { status: 409 }
      );
    }

    // Create check-in record
    const checkIn = await prisma.checkIn.create({
      data: {
        studentId,
        dojoId: student.dojoId,
        classId: targetClassId,
        checkedInAt: timestamp ? new Date(timestamp) : new Date(),
        method: method || "qr",
        tokensAwarded: 10,
      },
    });

    // Award DOJO tokens for attendance
    await prisma.tokenTransaction.create({
      data: {
        studentId,
        amount: 10,
        type: "attendance",
        description: "Class attendance",
      },
    });

    // Update student's last check-in and balance
    await prisma.student.update({
      where: { id: studentId },
      data: {
        lastCheckIn: new Date(),
        dojoBalance: { increment: 10 },
        totalEarned: { increment: 10 },
      },
    });

    return NextResponse.json({
      success: true,
      checkIn: {
        id: checkIn.id,
        timestamp: checkIn.checkedInAt,
        method: checkIn.method,
      },
      tokensAwarded: 10,
    });
  } catch (error: any) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Failed to check in" },
      { status: 500 }
    );
  }
}
