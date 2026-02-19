"use client";

import { useState } from "react";

interface CreateClassFormProps {
  instructors: { id: string; name: string }[];
  dojoId: string;
  onSuccess?: () => void;
}

export default function CreateClassForm({
  instructors,
  dojoId,
  onSuccess,
}: CreateClassFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    schedule: "",
    instructorId: "",
    maxStudents: 30,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dojoId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: "Class created successfully!" });
        setFormData({
          name: "",
          schedule: "",
          instructorId: "",
          maxStudents: 30,
        });
        onSuccess?.();
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create class",
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {result && (
        <div
          className={`p-3 rounded ${
            result.success ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Class Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
          placeholder="e.g., Kids BJJ Beginners"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Instructor *
        </label>
        <select
          required
          value={formData.instructorId}
          onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
        >
          <option value="">Select an instructor</option>
          {instructors.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Schedule *
        </label>
        <input
          type="text"
          required
          value={formData.schedule}
          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
          placeholder="e.g., Mon/Wed/Fri 18:00-19:30"
        />
        <p className="text-xs text-gray-500 mt-1">
          Describe days and times for this class
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Max Students
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={formData.maxStudents}
          onChange={(e) =>
            setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 30 })
          }
          className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg font-semibold transition"
      >
        {loading ? "Creating..." : "Create Class"}
      </button>
    </form>
  );
}
