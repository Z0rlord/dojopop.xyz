"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import QRScanner from "@/components/QRScanner";
import { useBLECheckIn } from "@/lib/ble-checkin";

export default function CheckInPage() {
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [useQR, setUseQR] = useState(false);

  // Get student ID from session/localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("studentId");
    if (stored) setStudentId(stored);
  }, []);

  const handleBLECheckIn = async () => {
    if (!("bluetooth" in navigator)) {
      setStatus("error");
      setMessage("Bluetooth not supported. Use QR code instead.");
      return;
    }

    setStatus("scanning");
    setMessage("Looking for instructor beacon...");

    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      });

      // In a real implementation, we'd verify the beacon UUID
      // For now, simulate successful check-in
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call API to record check-in
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          method: "ble",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Checked in successfully via Bluetooth!");
      } else {
        throw new Error("API error");
      }
    } catch (error: any) {
      if (error.name === "NotFoundError") {
        setStatus("error");
        setMessage("No instructor beacon found. Try QR code instead.");
      } else {
        setStatus("error");
        setMessage(`BLE failed: ${error.message}. Try QR code.`);
      }
    }
  };

  const handleQRCheckIn = async (qrData: string) => {
    setStatus("scanning");
    setMessage("Processing QR code...");

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          qrCode: qrData,
          method: "qr",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Checked in successfully via QR code!");
      } else {
        throw new Error(data.error || "Check-in failed");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(`QR check-in failed: ${error.message}`);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="border-2 border-accent p-8">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="font-heading text-2xl font-black text-foreground mb-4">CHECKED IN!</h2>
            <p className="text-foreground mb-6">{message}</p>
            <Link
              href="/student"
              className="inline-block uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto">
        <header className="mb-8">
          <Link href="/" className="font-heading font-black text-xl text-foreground">
            ← DOJO POP
          </Link>
          <h1 className="font-heading text-3xl font-black mt-6 text-foreground">CHECK IN</h1>
        </header>

        {status === "error" && (
          <div className="mb-6 border-l-4 border-accent pl-4 py-2">
            <p className="font-bold text-foreground">{message}</p>
          </div>
        )}

        {status === "scanning" && !useQR && (
          <div className="mb-6 border-2 border-neutral-900 p-8 text-center">
            <div className="animate-pulse text-4xl mb-4">📡</div>
            <p className="text-foreground">{message}</p>
            <button
              onClick={() => setUseQR(true)}
              className="mt-4 text-sm underline text-muted-foreground"
            >
              Switch to QR Code
            </button>
          </div>
        )}

        {!useQR && status !== "scanning" && (
          <div className="space-y-6">
            <div className="border-2 border-neutral-900 p-8 text-center">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                Automatic Check-In
              </h3>
              <p className="text-muted-foreground mb-6">
                Walk near your instructor with Bluetooth on
              </p>
              <button
                onClick={handleBLECheckIn}
                disabled={status === "scanning"}
                className="w-full uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-50 transition-colors"
              >
                {status === "scanning" ? "Scanning..." : "Start Bluetooth Check-In"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">OR</p>
              <button
                onClick={() => setUseQR(true)}
                className="text-foreground underline"
              >
                Use QR Code Instead
              </button>
            </div>
          </div>
        )}

        {useQR && (
          <div className="border-2 border-neutral-900 p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                QR Code Check-In
              </h3>
              <p className="text-muted-foreground">Scan the class QR code</p>
            </div>

            <QRScanner onScan={handleQRCheckIn} />

            <button
              onClick={() => {
                setUseQR(false);
                setStatus("idle");
                setMessage("");
              }}
              className="mt-6 w-full text-center text-muted-foreground underline"
            >
              Back to Bluetooth
            </button>
          </div>
        )}

        <div className="mt-8 border-2 border-neutral-900 p-4">
          <h4 className="font-bold text-foreground mb-2">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Bluetooth: Walk near instructor, auto-checks in</li>
            <li>• QR Code: Scan the code displayed in class</li>
            <li>• Both methods record your attendance instantly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
