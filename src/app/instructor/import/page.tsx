"use client";

import { useState } from "react";

export default function ImportPage() {
  const [formData, setFormData] = useState({
    spreadsheetId: "",
    range: "Sheet1",
    dojoId: "e6416114-d45d-47b3-9572-4418869d7bba", // Warsaw BJJ Academy
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    imported?: number;
    skipped?: number;
    errors?: string[];
    students?: any[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/import/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Import complete!`,
          imported: data.results.imported,
          skipped: data.results.skipped,
          errors: data.results.errors,
          students: data.results.students,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Import failed",
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

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-red-500">Import Students</h1>
          <p className="text-gray-400 mt-2">Import from Google Sheets</p>
        </header>

        {result && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              result.success ? "bg-green-900/30 border border-green-700" : "bg-red-900/30 border border-red-700"
            }`}
          >
            <p className="font-semibold">{result.message}</p>
            {result.success && (
              <div className="mt-2 space-y-1">
                <p className="text-green-300">✅ Imported: {result.imported}</p>
                <p className="text-yellow-300">⏭️ Skipped (duplicates): {result.skipped}</p>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-300">❌ Errors ({result.errors.length}):</p>
                    <ul className="text-sm text-red-400 list-disc list-inside">
                      {result.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>...and {result.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Google Sheet ID *
            </label>
            <input
              type="text"
              required
              value={formData.spreadsheetId}
              onChange={(e) =>
                setFormData({ ...formData, spreadsheetId: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-950 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            />
            <p className="text-xs text-gray-500 mt-1">
              From your Google Sheet URL: docs.google.com/spreadsheets/d/<strong>SHEET_ID</strong>/edit
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Sheet Range
            </label>
            <input
              type="text"
              value={formData.range}
              onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              className="w-full px-4 py-3 bg-gray-950 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
              placeholder="Sheet1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default: Sheet1. Use "Sheet2" or "A1:Z100" for specific ranges.
            </p>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Expected Columns:</h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li><strong>name</strong> (required) - Student full name</li>
              <li><strong>email</strong> (optional) - Email address</li>
              <li><strong>phone</strong> (optional) - Phone number</li>
              <li><strong>belt</strong> (optional) - Belt rank (white, yellow, etc.)</li>
              <li><strong>stripes</strong> (optional) - Number of stripes</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg font-semibold transition"
          >
            {loading ? "Importing..." : "Import Students"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h3 className="font-semibold mb-2">Setup Required:</h3>
          <p className="text-sm text-gray-400">
            To use Google Sheets import, you need to:
          </p>
          <ol className="text-sm text-gray-400 list-decimal list-inside mt-2 space-y-1">
            <li>Create a Google Cloud service account</li>
            <li>Enable Google Sheets API</li>
            <li>Share your sheet with the service account email</li>
            <li>Add credentials to environment variables</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
