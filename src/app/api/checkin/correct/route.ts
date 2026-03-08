import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Teacher correction endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, status, timestamp, method } = body;

    if (!studentId || !status) {
      return NextResponse.json(
        { error: "Student ID and status are required" },
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

    // Check if already has a check-in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        studentId,
        timestamp: {
          gte: today,
        },
      },
    });

    let checkIn;

    if (existingCheckIn) {
      // Update existing check-in
      checkIn = await prisma.checkIn.update({
        where: { id: existingCheckIn.id },
        data: {
          status,
          method: method || "manual",
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        },
      });
    } else {
      // Create new check-in
      checkIn = await prisma.checkIn.create({
        data: {
          studentId,
          dojoId: student.dojoId,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          method: method || "manual",
          status,
        },
      });
    }

    // If marking present and wasn't before, award tokens
    if (status === "present" && (!existingCheckIn || existingCheckIn.status !== "present")) {
      await prisma.tokenTransaction.create({
        data: {
          studentId,
          amount: 10,
          type: "attendance",
          description: "Class attendance (manual correction)",
        },
      });
    }

    return NextResponse.json({
      success: true,
      checkIn: {
        id: checkIn.id,
        studentId: checkIn.studentId,
        timestamp: checkIn.timestamp,
        method: checkIn.method,
        status: checkIn.status,
      },
    });
  } catch (error: any) {
    console.error("Correction error:", error);
    return NextResponse.json(
      { error: "Failed to correct attendance" },
      { status: 500 }
    );
  }
}
