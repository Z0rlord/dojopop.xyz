import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (userType === "instructor") {
      // Instructor login
      const instructor = await prisma.instructor.findUnique({
        where: { email },
      });

      if (!instructor) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, instructor.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          role: instructor.isAdmin ? "admin" : "instructor",
          dojoId: instructor.dojoId,
        },
      });
    } else {
      // Student login - find by email
      const student = await prisma.student.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });

      if (!student) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // For now, students log in with QR code as password
      // In production, they'd have a proper password
      const isValid = await bcrypt.compare(password, student.password || "");
      
      // Temporary: also allow QR code as password for backward compatibility
      const isQRCode = password === student.qrCode;

      if (!isValid && !isQRCode) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          role: "student",
          dojoId: student.dojoId,
        },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
