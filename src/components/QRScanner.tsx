"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

interface QRScannerProps {
  dojoId: string;
  onSuccess?: (student: { name: string; beltRank: string; stripes: number }) => void;
}

export default function QRScanner({ dojoId, onSuccess }: QRScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    student?: { name: string; beltRank: string; stripes: number };
  } | null>(null);

  const handleScan = async (qrCode: string) => {
    if (!scanning) return;
    setScanning(false);

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode, dojoId }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Check-in successful!",
          student: data.student,
        });
        onSuccess?.(data.student);
      } else {
        setResult({
          success: false,
          message: data.error || "Check-in failed",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setResult(null);
      setScanning(true);
    }, 3000);
  };

  if (result) {
    return (
      <div
        className={`p-6 rounded-lg text-center ${
          result.success ? "bg-green-900/50" : "bg-red-900/50"
        }`}
      >
        <p className="text-xl font-bold mb-2">
          {result.success ? "✅" : "❌"} {result.message}
        </p>
        {result.student && (
          <div className="text-gray-300">
            <p className="font-semibold">{result.student.name}</p>
            <p className="text-sm capitalize">
              {result.student.beltRank.toLowerCase()} belt, {result.student.stripes} stripes
            </p>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-4">Scanning again in 3 seconds...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="aspect-square rounded-lg overflow-hidden bg-black">
        <Scanner
          onScan={(detectedCodes) => {
            if (detectedCodes.length > 0) {
              handleScan(detectedCodes[0].rawValue);
            }
          }}
          onError={(error) => console.error("QR scan error:", error)}
          styles={{
            container: { width: "100%", height: "100%" },
          }}
        />
      </div>
      <p className="text-center text-gray-500 mt-4">
        Point camera at student QR code
      </p>
    </div>
  );
}
