"use client";

import { useEffect, useState } from "react";

interface CrossmintPaymentProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: Error) => void;
}

export default function CrossmintPayment({
  amount,
  currency = "usd",
  description,
  onSuccess,
  onError,
}: CrossmintPaymentProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Crossmint script
    const script = document.createElement("script");
    script.src = "https://www.crossmint.io/assets/crossmint-sdk.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError("Failed to load payment system");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !(window as any).CrossmintSDK) return;

    try {
      const CrossmintSDK = (window as any).CrossmintSDK;
      
      CrossmintSDK.init({
        apiKey: process.env.NEXT_PUBLIC_CROSSMINT_API_KEY,
        environment: "production", // or "staging" for testing
      });

      CrossmintSDK.createPaymentButton({
        target: "#crossmint-button",
        amount,
        currency,
        description,
        onSuccess: (orderId: string) => {
          console.log("Payment successful:", orderId);
          onSuccess?.(orderId);
        },
        onError: (err: Error) => {
          console.error("Payment error:", err);
          setError(err.message);
          onError?.(err);
        },
      });
    } catch (err) {
      setError("Failed to initialize payment");
      console.error(err);
    }
  }, [loaded, amount, currency, description, onSuccess, onError]);

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 rounded-lg text-red-400">
        Payment error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">{description}</span>
          <span className="text-2xl font-bold">
            ${amount} {currency.toUpperCase()}
          </span>
        </div>
        
        {!loaded ? (
          <div className="text-center py-4 text-gray-500">
            Loading payment system...
          </div>
        ) : (
          <div id="crossmint-button" className="w-full">
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              onClick={() => {
                // Fallback if SDK doesn't load properly
                window.open(
                  `https://www.crossmint.io/checkout?amount=${amount}&currency=${currency}&description=${encodeURIComponent(description)}`,
                  "_blank"
                );
              }}
            >
              Pay with Card / Crypto
            </button>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Secured by Crossmint — Accepts credit cards and crypto
      </p>
    </div>
  );
}
