"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"student" | "instructor">("student");
  const [formData, setFormData] = useState({
    qrCode: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const credentials =
      activeTab === "student"
        ? { qrCode: formData.qrCode }
        : { email: formData.email, password: formData.password };

    const result = await signIn("credentials", {
      ...credentials,
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
    <div className="min-h-screen bg-gray-950 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Dojo Pop</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </header>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-3 rounded-lg transition ${
              activeTab === "student"
                ? "bg-red-600"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("instructor")}
            className={`flex-1 py-3 rounded-lg transition ${
              activeTab === "instructor"
                ? "bg-red-600"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            Instructor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "student" ? (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                QR Code
              </label>
              <input
                type="text"
                required
                value={formData.qrCode}
                onChange={(e) =>
                  setFormData({ ...formData, qrCode: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
                placeholder="Scan or enter your QR code"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find your QR code in your email or ask your instructor
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
                  placeholder="instructor@dojopop.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-red-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
