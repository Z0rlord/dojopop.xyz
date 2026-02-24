"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    qrCode?: string;
    studentName?: string;
    emailSent?: boolean;
    isDuplicate?: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dojoId: "e6416114-d45d-47b3-9572-4418869d7bba",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Record created. Your QR code is ready.",
          qrCode: data.student.qrCode,
          studentName: data.student.name,
          emailSent: data.student.emailSent,
        });
      } else {
        const isDuplicate = response.status === 409;
        setResult({
          success: false,
          message: data.error || "Failed to create record",
          isDuplicate,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (result?.success && result.qrCode) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="max-w-md w-full border-2 border-neutral-900 p-8">
          <div className="border-l-4 border-accent pl-4 mb-6">
            <h2 className="font-heading text-2xl font-black">RECORD CREATED</h2>
          </div>

          <div className="border-2 border-neutral-900 p-4 mb-6">
            <p className="font-heading font-bold">{result.studentName}</p>
            <div className="mt-4 bg-neutral-100 aspect-square flex items-center justify-center">
              <span className="text-neutral-400 text-sm">QR: {result.qrCode.slice(0, 8)}...</span>
            </div>
          </div>

          <p className="text-sm mb-6">Save this QR code. Use it to check in at class.</p>

          <Link
            href="/"
            className="block w-full text-center uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
          >
            Done
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="mb-8">
          <Link href="/" className="font-heading font-black text-xl">← DOJO POP</Link>
          <h1 className="font-heading text-3xl font-black mt-6">JOIN</h1>
          <p className="text-neutral-500 mt-2">Create your practice record.</p>
        </header>

        {result && !result.success && (
          <div className="mb-6 border-l-4 border-accent pl-4 py-2">
            <p className="font-bold">{result.message}</p>
            {result.isDuplicate && (
              <div className="mt-2 text-sm">
                <Link href="/login" className="underline">Sign in</Link>
                {" / "}
                <Link href="/forgot-password" className="underline">Reset password</Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating..." : "Create Record"}
          </button>
        </form>

        <p className="mt-6 text-sm">
          Have an account?{" "}
          <Link href="/login" className="underline font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
