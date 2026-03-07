import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple base64 image storage (for beta - move to cloud storage for production)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const studentId = formData.get("studentId") as string;
    const file = formData.get("avatar") as File;

    if (!studentId || !file) {
      return NextResponse.json(
        { error: "Student ID and avatar required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files allowed" },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update student
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { avatar: dataUrl },
    });

    return NextResponse.json({
      success: true,
      avatar: dataUrl,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
