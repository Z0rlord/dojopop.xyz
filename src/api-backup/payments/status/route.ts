import { NextRequest, NextResponse } from "next/server";

const CROSSMINT_API = "https://www.crossmint.com/api/2022-06-09";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.CROSSMINT_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment provider not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${CROSSMINT_API}/orders/${orderId}`, {
      headers: {
        "X-API-KEY": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order status");
    }

    const data = await response.json();

    return NextResponse.json({
      orderId: data.id,
      status: data.status, // "pending", "completed", "failed"
      amount: data.amount,
      currency: data.currency,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
