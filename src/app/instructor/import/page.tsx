"use client";

import { useState } from "react";

export default function ImportPage() {
  const [formData, setFormData] = useState({
    spreadsheetId: "",
    range: "Sheet1",
    dojoId: "e6416114-d45d-47b3-9572-4418869d7bba",
    importCheckIns: true,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    studentsImported?: number;
    studentsSkipped?: number;
    checkInsImported?: number;
    schoolsFound?: string[];
    totalRowsProcessed?: number;
    errors?: string[];
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
          message: "Import complete!",
          studentsImported: data.results.studentsImported,
          studentsSkipped: data.results.studentsSkipped,
          checkInsImported: data.results.checkInsImported,
          schoolsFound: data.results.schoolsFound,
          totalRowsProcessed: data.results.totalRowsProcessed,
          errors: data.results.errors,
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
          <h1 className="text-3xl font-bold text-red-500">Import Alpha Data</h1>
          <p className="text-gray-400 mt-2">Import students and check-ins from Google Sheets</p>
        </header>

        {result && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              result.success ? "bg-green-900/30 border border-green-700" : "bg-red-900/30 border border-red-700"
            }`}
          >
            <p className="font-semibold">{result.message}</p>
            
            {result.success && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-900 rounded">
                    <p className="text-2xl font-bold text-green-400">{result.studentsImported}</p>
                    <p className="text-sm text-gray-400">Students Imported</p>
                  </div>
                  <div className="p-3 bg-gray-900 rounded">
                    <p className="text-2xl font-bold text-blue-400">{result.checkInsImported}</p>
                    <p className="text-sm text-gray-400">Check-ins Imported</p>
                  </div>
                </div>
                
                {result.studentsSkipped ? (
                  <p className="text-yellow-300 text-sm">
                    ⏭️ {result.studentsSkipped} students already existed (skipped)
                  </p>
                ) : null}
                
                {result.schoolsFound && result.schoolsFound.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Schools found: {result.schoolsFound.join(", ")}</p>
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Total rows processed: {result.totalRowsProcessed}
                </p>
                
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-300 text-sm">❌ Errors ({result.errors.length}):</p>
                    <ul className="text-xs text-red-400 list-disc list-inside max-h-32 overflow-y-auto">
                      {result.errors.slice(0, 10).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {result.errors.length > 10 && (
                        <li>...and {result.errors.length - 10} more</li>
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
              placeholder="Sheet1 or Sheet1!A1:Z1000"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              id="importCheckIns"
              checked={formData.importCheckIns}
              onChange={(e) =>
                setFormData({ ...formData, importCheckIns: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-red-600"
            />
            <label htmlFor="importCheckIns" className="text-sm text-gray-300">
              Import check-in history (dates)
            </label>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Expected Columns:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
              <div><strong>name</strong> (required)</div>
              <div><strong>email</strong> (optional)</div>
              <div><strong>phone</strong> (optional)</div>
              <div><strong>belt/rank</strong> (optional)</div>
              <div><strong>stripes</strong> (optional)</div>
              <div><strong>date/check-in</strong> (optional)</div>
              <div><strong>school/location</strong> (optional)</div>
              <div><strong>class/session</strong> (optional)</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg font-semibold transition"
          >
            {loading ? "Importing..." : "Import 1,000+ Records"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-900 rounded-lg text-sm text-gray-400">
          <p className="font-semibold mb-2">For 10 Schools:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All students get unique QR codes</li>
            <li>Check-ins are preserved with original dates</li>
            <li>Duplicate detection prevents double imports</li>
            <li>School names tracked for reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
