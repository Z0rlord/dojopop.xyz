import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, TokenTransactionType } from "@prisma/client";

const prisma = new PrismaClient();

// Token rewards configuration
const TOKEN_REWARDS = {
  CHECK_IN: 1,
  STREAK_BONUS: 5,
  WEEKLY_STREAK: 10,
  BELT_PROMOTION: 100,
  VIDEO_UPLOAD: 10,
  REFERRAL: 50,
};

export async function POST(request: NextRequest) {
  try {
    const { studentId, type, description, relatedId } = await request.json();

    if (!studentId || !type) {
      return NextResponse.json(
        { error: "studentId and type required" },
        { status: 400 }
      );
    }

    const amount = TOKEN_REWARDS[type as keyof typeof TOKEN_REWARDS];
    if (!amount) {
      return NextResponse.json(
        { error: "Invalid reward type" },
        { status: 400 }
      );
    }

    // Create transaction and update balance
    const [transaction] = await prisma.$transaction([
      prisma.tokenTransaction.create({
        data: {
          studentId,
          amount,
          type: type as TokenTransactionType,
          description: description || `${type} reward`,
          relatedId,
        },
      }),
      prisma.student.update({
        where: { id: studentId },
        data: {
          dojoBalance: { increment: amount },
          totalEarned: { increment: amount },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      transaction,
      amount,
    });
  } catch (error) {
    console.error("Award tokens error:", error);
    return NextResponse.json(
      { error: "Failed to award tokens" },
      { status: 500 }
    );
  }
}

// Get student token balance and history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId required" },
        { status: 400 }
      );
    }

    const [student, transactions] = await Promise.all([
      prisma.student.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          name: true,
          dojoBalance: true,
          totalEarned: true,
          totalSpent: true,
        },
      }),
      prisma.tokenTransaction.findMany({
        where: { studentId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      student,
      transactions,
    });
  } catch (error) {
    console.error("Get tokens error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
