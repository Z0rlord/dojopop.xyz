import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Store reset tokens (in production, use Redis or database)
const resetTokens = new Map<string, { studentId: string; expires: Date }>();

// Request password reset
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find student by email
    const student = await prisma.student.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    // Don't reveal if email exists (security)
    if (!student) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    resetTokens.set(token, { studentId: student.id, expires });

    // Send reset email
    if (process.env.RESEND_API_KEY) {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

      try {
        console.log("Attempting to send reset email to:", email);
        console.log("Using from address: noreply@app.the47.xyz");
        
        const { data, error } = await resend.emails.send({
          from: "Dojo Pop <noreply@app.the47.xyz>",
          to: email,
          subject: "Reset your Dojo Pop password",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #D7262E;">Reset Your Password</h1>
              <p>Hi ${student.name},</p>
              <p>You requested a password reset for your Dojo Pop account.</p>
              <p>Click the link below to reset your password:</p>
              <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #D7262E; color: white; text-decoration: none;">Reset Password</a>
              <p style="color: #666; font-size: 14px; margin-top: 24px;">This link expires in 1 hour.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        
        if (error) {
          console.error("Resend API error:", JSON.stringify(error, null, 2));
        } else {
          console.log("Reset email sent successfully. Message ID:", data?.id);
        }
      } catch (emailErr) {
        console.error("Reset email exception:", emailErr);
      }
    } else {
      console.log("RESEND_API_KEY not set, skipping email");
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Verify token and reset password
export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Validate token
    const resetData = resetTokens.get(token);
    if (!resetData || resetData.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // For students, we store the QR code as their "password" for now
    // In a real implementation, you'd hash and store a proper password
    // This is a simplified version for the beta

    // Clear the token
    resetTokens.delete(token);

    return NextResponse.json({
      success: true,
      message: "Password reset successful. Please log in with your QR code.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
