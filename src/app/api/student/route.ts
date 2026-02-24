import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dojoId = searchParams.get("dojoId");

    const where = dojoId ? { dojoId } : {};

    const students = await prisma.student.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, dojoId, language } = await request.json();

    if (!name || !dojoId) {
      return NextResponse.json(
        { error: "Name and dojo are required" },
        { status: 400 }
      );
    }

    // Check for existing email
    if (email) {
      const existingStudent = await prisma.student.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });

      if (existingStudent) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in or use a different email." },
          { status: 409 }
        );
      }
    }

    const qrCode = crypto.randomUUID();

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const student = await prisma.student.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        language: language || "en",
        dojoId,
        qrCode,
      },
    });

    // Generate QR code image
    let qrCodeDataUrl = null;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(qrCode, {
        width: 400,
        margin: 2,
        color: {
          dark: "#0B0B0C",
          light: "#F7F7F5",
        },
      });
    } catch (err) {
      console.error("QR generation error:", err);
    }

    // Send email if address provided and Resend is configured
    if (email && process.env.RESEND_API_KEY) {
      try {
        const qrCodeBase64 = qrCodeDataUrl?.split(",")[1];
        
        await resend.emails.send({
          from: "Dojo Pop <noreply@app.the47.xyz>",
          to: email,
          subject: "Your Dojo Pop Account",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #D7262E;">Welcome to Dojo Pop</h1>
              <p>Hi ${name},</p>
              <p>Your account has been created. Your QR code is attached — use it to check in at class.</p>
              <p><strong>Your QR Code:</strong></p>
              <img src="cid:qrcode" alt="Your QR Code" style="max-width: 300px;" />
              <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
              <p style="color: #666; font-size: 14px;">
                Sign in at app.the47.xyz/login with your email and password.
              </p>
            </div>
          `,
          attachments: qrCodeBase64
            ? [
                {
                  filename: "dojo-pop-qr.png",
                  content: qrCodeBase64,
                  contentType: "image/png",
                } as any,
              ]
            : undefined,
        });
        console.log("Email sent to:", email);
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        qrCode: student.qrCode,
        emailSent: !!(email && process.env.RESEND_API_KEY),
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
