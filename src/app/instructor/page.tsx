"use client";

import { useState } from "react";
import StudentQR from "@/components/StudentQR";

// Mock students for demo
const mockStudents = [
  { id: "stu_001", name: "Jan Kowalski", beltRank: "WHITE", stripes: 2 },
  { id: "stu_002", name: "Anna Nowak", beltRank: "YELLOW", stripes: 1 },
  { id: "stu_003", name: "Piotr Wiśniewski", beltRank: "ORANGE", stripes: 0 },
];

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState<"students" | "qr" | "checkins">("students");

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-red-500">Instructor Dashboard</h1>
          <p className="text-gray-400">Manage students and generate QR codes</p>
        </header>

        <nav className="flex gap-4 mb-6 border-b border-gray-800 pb-4">
          {(["students", "qr", "checkins"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded transition capitalize ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "students" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Students</h2>
            {mockStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 bg-gray-900 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-gray-400 capitalize">
                    {student.beltRank.toLowerCase()} belt, {student.stripes} stripes
                  </p>
                </div>
                <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "qr" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Generate QR Codes</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockStudents.map((student) => (
                <StudentQR
                  key={student.id}
                  studentId={student.id}
                  studentName={student.name}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "checkins" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Check-ins</h2>
            <p className="text-gray-500">No check-ins yet today.</p>
          </div>
        )}
      </div>
    </div>
  );
}
