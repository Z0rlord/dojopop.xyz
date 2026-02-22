"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
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
          message: "Welcome to Dojo Pop! Your QR code is ready.",
          qrCode: data.student.qrCode,
          studentName: data.student.name,
          emailSent: data.student.emailSent,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Something went wrong",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (result?.success && result.qrCode) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20">
            <h2 className="text-2xl font-bold text-accent mb-2">Welcome!</h2>
            <p className="text-foreground">{result.message}</p>
            {result.emailSent && (
              <p className="text-sm text-muted-foreground mt-2">
                QR code also sent to your email
              </p>
            )}
          </div>

          <div className="p-6 bg-surface rounded-2xl shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-foreground">{result.studentName}</h3>
            <div className="bg-background p-4 rounded-xl inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                  result.qrCode
                )}&color=c4705a&bgcolor=f5f0e8`}
                alt="Your QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Save this QR code! Show it at the dojo to check in.
            </p>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                result.qrCode
              )}&color=c4705a&bgcolor=f5f0e8`}
              download="dojo-pop-qr.png"
              className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg text-sm font-medium transition"
            >
              Download QR Code
            </a>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-medium transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Join Dojo Pop</h1>
          <p className="text-muted-foreground mt-2">Create your student account</p>
        </header>

        {result && !result.success && (
          <div className="mb-4 p-4 bg-error/10 rounded-xl text-error">
            {result.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-xl border border-surface-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Jan Kowalski"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-xl border border-surface-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              placeholder="jan@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;ll send your QR code here
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-xl border border-surface-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              placeholder="+48 123 456 789"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-muted text-primary-foreground rounded-xl font-semibold transition shadow-sm"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <a href="/" className="text-primary hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
