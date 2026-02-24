"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setResult({
        success: data.success,
        message: data.message || "If an account exists, a reset link has been sent.",
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to send reset request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Forgot Password</h1>
          <p className="text-muted-foreground mt-2">Enter your email to reset your password</p>
        </header>

        {result && (
          <div className={`mb-6 p-4 rounded-xl ${result.success ? "bg-accent/10 text-accent" : "bg-error/10 text-error"}`}>
            {result.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-xl border border-surface-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-muted text-primary-foreground rounded-xl font-semibold transition shadow-sm"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
