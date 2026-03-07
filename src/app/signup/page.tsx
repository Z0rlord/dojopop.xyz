"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "pl", label: "Polski" },
  { code: "it", label: "Italiano" },
];

export default function SignupPage() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    language: "en",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdStudent, setCreatedStudent] = useState<{
    id: string;
    name: string;
    email: string;
    qrCode: string;
    emailSent: boolean;
  } | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          language: formData.language,
          dojoId: "e6416114-d45d-47b3-9572-4418869d7bba",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedStudent(data.student);
        
        // Generate QR code image
        const qrDataUrl = await QRCode.toDataURL(data.student.qrCode, {
          width: 400,
          margin: 2,
          color: {
            dark: "#0B0B0C",
            light: "#F7F7F5",
          },
        });
        setQrImage(qrDataUrl);
        
        setStep("success");
      } else if (response.status === 409) {
        setError("An account with this email already exists. Please sign in.");
      } else {
        setError(data.error || "Failed to create account");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success" && createdStudent && qrImage) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-lg mx-auto">
          <header className="mb-8">
            <Link href="/" className="font-heading font-black text-xl">← DOJO POP</Link>
          </header>

          <div className="border-2 border-neutral-900 p-8">
            <div className="border-l-4 border-accent pl-4 mb-6">
              <h2 className="font-heading text-2xl font-black">ACCOUNT CREATED</h2>
            </div>

            <div className="space-y-6">
              {/* QR Code */}
              <div className="border-2 border-neutral-900 p-4">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Your Check-In QR Code</p>
                <img 
                  src={qrImage} 
                  alt="Your QR Code" 
                  className="w-full max-w-[300px] mx-auto"
                />
                <a
                  href={qrImage}
                  download={`dojo-pop-qr-${createdStudent.name.replace(/\s+/g, '-').toLowerCase()}.png`}
                  className="block w-full text-center mt-4 uppercase tracking-[0.2em] text-xs font-bold px-4 py-3 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
                >
                  Download QR Code
                </a>
              </div>

              {/* Account Details */}
              <div className="border-2 border-neutral-900 p-4 bg-surface">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-2">Account Details</p>
                <p className="font-bold">{createdStudent.name}</p>
                <p className="text-neutral-500">{createdStudent.email}</p>
              </div>

              {/* Important Info */}
              <div className="space-y-4 text-sm">
                <div className="border-l-4 border-accent pl-4">
                  <p className="font-bold mb-1">Save Your QR Code</p>
                  <p>Screenshot or download this QR code. You'll use it to check in at class.</p>
                </div>

                <div className="border-l-4 border-neutral-900 pl-4">
                  <p className="font-bold mb-1">Sign In With Email</p>
                  <p>Use your email and password to access your account dashboard.</p>
                </div>

                {createdStudent.emailSent && (
                  <div className="border-l-4 border-neutral-900 pl-4">
                    <p className="font-bold mb-1">Check Your Email</p>
                    <p>We've sent your QR code to {createdStudent.email}</p>
                  </div>
                )}
              </div>

              <Link
                href="/login"
                className="block w-full text-center uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="mb-8">
          <Link href="/" className="font-heading font-black text-xl text-foreground">← DOJO POP</Link>
          <h1 className="font-heading text-3xl font-black mt-6 text-foreground">JOIN</h1>
          <p className="text-muted-foreground mt-2">Create your practice record.</p>
        </header>

        {error && (
          <div className="mb-6 border-l-4 border-accent pl-4 py-2">
            <p className="font-bold">{error}</p>
            {error.includes("already exists") && (
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
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2 text-foreground">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none text-foreground"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2 text-foreground">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none text-foreground"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2 text-foreground">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none text-foreground"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2 text-foreground">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none text-foreground"
              placeholder="Create a password"
            />
            <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2 text-foreground">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none text-foreground"
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-3 text-foreground">
              Language
            </label>
            <div className="grid grid-cols-2 gap-0 border-2 border-neutral-900">
              {LANGUAGES.map((lang) => (
                <label
                  key={lang.code}
                  className={`flex items-center justify-center px-4 py-3 cursor-pointer transition-colors ${
                    formData.language === lang.code
                      ? "bg-neutral-950 text-neutral-50"
                      : "bg-surface hover:bg-neutral-100"
                  } ${lang.code !== "en" ? "border-t-2 border-neutral-900" : ""} ${
                    lang.code === "ja" || lang.code === "it" ? "border-l-2 border-neutral-900" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    checked={formData.language === lang.code}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold">{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating..." : "Create Account"}
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
