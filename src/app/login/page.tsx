"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"student" | "instructor">("student");
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
      userType,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(userType === "student" ? "/student" : "/instructor");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your Dojo Pop account</p>
        </header>

        {/* User Type Toggle */}
        <div className="flex gap-2 p-1 bg-surface rounded-xl mb-6">
          <button
            onClick={() => setUserType("student")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              userType === "student"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-background"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setUserType("instructor")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              userType === "instructor"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-background"
            }`}
          >
            Instructor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error/10 rounded-xl text-error text-sm">
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
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-xl border border-surface-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              placeholder={userType === "student" ? "your@email.com" : "instructor@dojo.com"}
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
              className="w-full px-4 py-3 bg-surface text-surface-foreground rounded-xl border border-surface-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="rounded border-surface-border" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-muted text-primary-foreground rounded-xl font-semibold transition shadow-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </p>
          
          {userType === "student" && (
            <p className="text-xs text-muted">
              💡 Use your QR code to check in at class, not to log in
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
