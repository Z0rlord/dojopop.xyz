import { NextRequest, NextResponse } from "next/server";

const CROSSMINT_API = "https://www.crossmint.com/api/2022-06-09";

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, description, recipientEmail } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency required" },
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

    // Create a Crossmint order
    const response = await fetch(`${CROSSMINT_API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        recipient: {
          email: recipientEmail,
        },
        lineItems: [
          {
            description,
            quantity: 1,
            amount,
            currency,
          },
        ],
        payment: {
          method: "fiat", // or "crypto" for crypto-only
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Crossmint API error: ${error}`);
    }

    const data = await response.json();

    return NextResponse.json({
      orderId: data.id,
      checkoutUrl: data.checkoutUrl,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
