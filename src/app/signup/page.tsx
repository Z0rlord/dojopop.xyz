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
          dojoId: "e6416114-d45d-47b3-9572-4418869d7bba", // Warsaw BJJ Academy
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
      <div className="min-h-screen bg-gray-950 p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="p-6 bg-green-900/30 rounded-lg border border-green-700">
            <h2 className="text-2xl font-bold text-green-400 mb-2">✅ Success!</h2>
            <p className="text-gray-300">{result.message}</p>
            {result.emailSent && (
              <p className="text-sm text-green-300 mt-2">
                📧 QR code also sent to your email!
              </p>
            )}
          </div>

          <div className="p-6 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-4">{result.studentName}</h3>
            <div className="bg-white p-4 rounded-lg inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                  result.qrCode
                )}&color=dc2626&bgcolor=1a1a1a`}
                alt="Your QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Save this QR code! Show it at the dojo to check in.
            </p>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                result.qrCode
              )}&color=dc2626&bgcolor=1a1a1a`}
              download="dojo-pop-qr.png"
              className="inline-block mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
            >
              Download QR Code
            </a>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Join Dojo Pop</h1>
          <p className="text-gray-400 mt-2">Create your student account</p>
        </header>

        {result && !result.success && (
          <div className="mb-4 p-4 bg-red-900/30 rounded-lg text-red-400">
            {result.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
              placeholder="Jan Kowalski"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
              placeholder="jan@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              We&apos;ll send your QR code here
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
              placeholder="+48 123 456 789"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg font-semibold transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/" className="text-red-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
