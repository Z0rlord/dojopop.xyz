import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
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
    const { name, email, phone, dojoId } = await request.json();

    if (!name || !dojoId) {
      return NextResponse.json(
        { error: "Name and dojo are required" },
        { status: 400 }
      );
    }

    const qrCode = crypto.randomUUID();

    const student = await prisma.student.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
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
          dark: "#dc2626",
          light: "#1a1a1a",
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
          from: "Dojo Pop <onboarding@resend.dev>",
          to: email,
          subject: "Welcome to Dojo Pop - Your QR Code",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc2626;">Welcome to Dojo Pop! 🥋</h1>
              <p>Hi ${name},</p>
              <p>You're all set up. Your QR code is attached — save it to your phone and show it at the dojo to check in.</p>
              <p><strong>Your QR Code:</strong></p>
              <img src="cid:qrcode" alt="Your QR Code" style="max-width: 300px;" />
              <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
              <p style="color: #666; font-size: 14px;">
                Keep this email safe. If you lose your QR code, ask your instructor for help.
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
        // Don't fail the signup if email fails
      }
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
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
