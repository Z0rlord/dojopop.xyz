"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"student" | "instructor">("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push(activeTab === "student" ? "/student" : "/instructor");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="mb-8">
          <Link href="/" className="font-heading font-black text-xl text-foreground">← DOJO POP</Link>
          <h1 className="font-heading text-3xl font-black mt-6 text-foreground">SIGN IN</h1>
        </header>

        <div className="flex gap-0 mb-6 border-2 border-neutral-900">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-3 uppercase tracking-widest text-sm font-bold transition-colors ${
              activeTab === "student"
                ? "bg-neutral-950 text-neutral-50"
                : "bg-transparent text-neutral-950"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("instructor")}
            className={`flex-1 py-3 uppercase tracking-widest text-sm font-bold border-l-2 border-neutral-900 transition-colors ${
              activeTab === "instructor"
                ? "bg-neutral-950 text-neutral-50"
                : "bg-transparent text-neutral-950"
            }`}
          >
            Instructor
          </button>
        </div>

        {error && (
          <div className="mb-6 border-l-4 border-accent pl-4 py-2">
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2 text-foreground">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2 text-foreground">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 focus:border-accent focus:outline-none text-foreground"
            />
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full uppercase tracking-[0.2em] text-sm font-bold px-8 py-4 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm">
          No account?{" "}
          <Link href="/signup" className="underline font-bold">Join</Link>
        </p>
      </div>
    </div>
  );
}
