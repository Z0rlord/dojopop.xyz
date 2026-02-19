"use client";

import { useState } from "react";

interface CrossmintPaymentProps {
  amount: number;
  currency?: string;
  description: string;
  recipientEmail?: string;
  onSuccess?: (orderId: string) => void;
}

export default function CrossmintPayment({
  amount,
  currency = "usd",
  description,
  recipientEmail,
  onSuccess,
}: CrossmintPaymentProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Call our API to create a Crossmint checkout session
      const response = await fetch("/api/payments/crossmint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          description,
          recipientEmail,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Open Crossmint hosted checkout in popup
        const width = 500;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          data.checkoutUrl,
          "CrossmintCheckout",
          `width=${width},height=${height},left=${left},top=${top},popup=1`
        );

        // Listen for payment completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setLoading(false);
            // Poll for order status or rely on webhook
            checkOrderStatus(data.orderId);
          }
        }, 1000);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
    }
  };

  const checkOrderStatus = async (orderId: string) => {
    // Poll for order status
    try {
      const response = await fetch(`/api/payments/status?orderId=${orderId}`);
      const data = await response.json();

      if (data.status === "completed") {
        onSuccess?.(orderId);
      }
    } catch (err) {
      console.error("Status check error:", err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg font-semibold transition flex items-center justify-center gap-2"
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          Pay with Card or Crypto
        </>
      )}
    </button>
  );
}
