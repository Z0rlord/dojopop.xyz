"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(activeTab === "student" ? "/student" : "/instructor");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Dojo Pop</h1>
          <p className="text-foreground mt-2">Sign in to your account</p>
        </header>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-3 rounded-lg transition ${
              activeTab === "student"
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("instructor")}
            className={`flex-1 py-3 rounded-lg transition ${
              activeTab === "instructor"
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground"
            }`}
          >
            Instructor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error/10 rounded-lg text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-lg border border-surface-border focus:border-primary focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-lg border border-surface-border focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-surface rounded-lg font-semibold transition text-primary-foreground"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-foreground">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
