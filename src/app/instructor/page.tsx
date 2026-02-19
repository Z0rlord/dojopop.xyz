"use client";

import { useState } from "react";
import StudentQR from "@/components/StudentQR";
import CreateClassForm from "@/components/CreateClassForm";

interface Class {
  id: string;
  name: string;
  instructor: { name: string };
  schedule: string;
  maxStudents: number;
}

const mockClasses: Class[] = [
  { id: "cls_001", name: "Kids BJJ", instructor: { name: "Sensei Mike" }, schedule: "Mon/Wed 16:00", maxStudents: 20 },
  { id: "cls_002", name: "Adult BJJ", instructor: { name: "Professor Ana" }, schedule: "Mon/Wed 19:00", maxStudents: 30 },
  { id: "cls_003", name: "Muay Thai", instructor: { name: "Kru Tom" }, schedule: "Tue/Thu 18:00", maxStudents: 25 },
];

const mockInstructors = [
  { id: "inst_001", name: "Sensei Mike" },
  { id: "inst_002", name: "Professor Ana" },
  { id: "inst_003", name: "Kru Tom" },
];

const mockStudents = [
  { id: "stu_001", name: "Jan Kowalski", beltRank: "WHITE", stripes: 2 },
  { id: "stu_002", name: "Anna Nowak", beltRank: "YELLOW", stripes: 1 },
  { id: "stu_003", name: "Piotr Wiśniewski", beltRank: "ORANGE", stripes: 0 },
];

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState<"students" | "qr" | "classes" | "checkins">("students");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const selectedClassData = mockClasses.find((c) => c.id === selectedClass);

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-red-500">Instructor Dashboard</h1>
          <p className="text-gray-400">Manage classes, students, and check-ins</p>
        </header>

        <nav className="flex gap-4 mb-6 border-b border-gray-800 pb-4 overflow-x-auto">
          {(["students", "classes", "qr", "checkins"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setShowCreateForm(false);
              }}
              className={`px-4 py-2 rounded transition capitalize whitespace-nowrap ${
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Students</h2>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-gray-800 rounded border border-gray-700"
              >
                <option value="">All Classes</option>
                {mockClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.instructor.name}
                  </option>
                ))}
              </select>
            </div>

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

        {activeTab === "classes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Classes</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
              >
                {showCreateForm ? "Cancel" : "+ Create Class"}
              </button>
            </div>

            {showCreateForm && (
              <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Create New Class</h3>
                <CreateClassForm
                  instructors={mockInstructors}
                  dojoId="demo-dojo-id"
                  onSuccess={() => {
                    setShowCreateForm(false);
                    // In production, refresh class list here
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              {mockClasses.map((cls) => (
                <div key={cls.id} className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{cls.name}</p>
                      <p className="text-gray-400">Instructor: {cls.instructor.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{cls.schedule}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Max {cls.maxStudents} students
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                      View Check-ins
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Check-ins</h2>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-gray-800 rounded border border-gray-700"
              >
                <option value="">All Classes</option>
                {mockClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedClassData ? (
              <div className="p-4 bg-gray-900 rounded-lg">
                <p className="text-gray-400">
                  Showing check-ins for <strong>{selectedClassData.name}</strong> with{" "}
                  {selectedClassData.instructor.name}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Select a class to view check-ins</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
