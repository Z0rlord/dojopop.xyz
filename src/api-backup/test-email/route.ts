import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    console.log("Testing Resend with email:", email);
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("From address: noreply@app.the47.xyz");

    const { data, error } = await resend.emails.send({
      from: "Dojo Pop <noreply@app.the47.xyz>",
      to: email,
      subject: "Test Email from Dojo Pop",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #D7262E;">Test Email</h1>
          <p>This is a test email from Dojo Pop.</p>
          <p>If you received this, Resend is working correctly.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send", details: error },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (err) {
    console.error("Exception:", err);
    return NextResponse.json(
      { error: "Exception occurred", details: String(err) },
      { status: 500 }
    );
  }
}
