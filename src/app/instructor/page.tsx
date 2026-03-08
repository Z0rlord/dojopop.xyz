"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Student {
  id: string;
  name: string;
  email: string;
  qrCode: string;
  beltRank: string;
}

interface CheckIn {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  method: "ble" | "qr" | "manual";
  status: "present" | "absent" | "late";
}

interface Class {
  id: string;
  name: string;
  schedule: string;
  location?: string;
  maxStudents: number;
  instructorName: string;
}

export default function InstructorDashboard() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [activeTab, setActiveTab] = useState<"checkin" | "classes" | "attendance">("checkin");
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [correctionStatus, setCorrectionStatus] = useState<"present" | "absent" | "late">("present");
  const [selectedClass, setSelectedClass] = useState("");

  // Class creation form state
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [classForm, setClassForm] = useState({
    name: "",
    schedule: "",
    location: "",
    maxStudents: 20,
  });
  const [createClassLoading, setCreateClassLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchTodayCheckIns();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    const response = await fetch("/api/students");
    if (response.ok) {
      const data = await response.json();
      setStudents(data.students);
    }
  };

  const fetchTodayCheckIns = async () => {
    const response = await fetch("/api/checkin/today");
    if (response.ok) {
      const data = await response.json();
      setTodayCheckIns(data.checkIns);
    }
  };

  const fetchClasses = async () => {
    const response = await fetch("/api/classes");
    if (response.ok) {
      const data = await response.json();
      setClasses(data.classes);
    }
  };

  const toggleBeacon = () => {
    setIsBeaconActive(!isBeaconActive);
  };

  const openCorrectionModal = (student: Student) => {
    setSelectedStudent(student);
    setCorrectionStatus("present");
    setShowCorrectionModal(true);
  };

  const submitCorrection = async () => {
    if (!selectedStudent) return;

    const response = await fetch("/api/checkin/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: selectedStudent.id,
        status: correctionStatus,
        timestamp: new Date().toISOString(),
        method: "manual",
      }),
    });

    if (response.ok) {
      setShowCorrectionModal(false);
      fetchTodayCheckIns();
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateClassLoading(true);

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classForm),
      });

      if (response.ok) {
        setShowCreateClassModal(false);
        setClassForm({ name: "", schedule: "", location: "", maxStudents: 20 });
        fetchClasses();
      } else {
        alert("Failed to create class");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setCreateClassLoading(false);
    }
  };

  const generateClassQR = () => {
    const classQR = `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return classQR;
  };

  const presentCount = todayCheckIns.filter((c) => c.status === "present").length;
  const absentStudents = students.filter(
    (s) => !todayCheckIns.some((c) => c.studentId === s.id && c.status === "present")
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="font-heading font-black text-xl text-foreground">
              ← DOJO POP
            </Link>
            <h1 className="font-heading text-3xl font-black mt-6 text-foreground">INSTRUCTOR DASHBOARD</h1>
            <p className="text-muted-foreground mt-2">Welcome, {session?.user?.name}</p>
          </div>
          <Link href="/" className="text-sm text-muted-foreground underline">Logout</Link>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b-2 border-neutral-900">
          {[
            { id: "checkin", label: "CHECK-IN", icon: "📡" },
            { id: "classes", label: "CLASSES", icon: "📅" },
            { id: "attendance", label: "ATTENDANCE", icon: "👥" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-bold text-sm tracking-widest transition-colors ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-neutral-50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CHECK-IN TAB */}
        {activeTab === "checkin" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="border-2 border-neutral-900 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Present Today</p>
                <p className="font-heading text-4xl font-black text-foreground">{presentCount}</p>
              </div>
              <div className="border-2 border-neutral-900 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Absent</p>
                <p className="font-heading text-4xl font-black text-accent">{absentStudents.length}</p>
              </div>
              <div className="border-2 border-neutral-900 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Total Students</p>
                <p className="font-heading text-4xl font-black text-foreground">{students.length}</p>
              </div>
            </div>

            {/* Check-in Controls */}
            <div className="border-2 border-neutral-900 p-6 mb-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-6">Class Check-In Controls</h2>
              
              <div className="grid grid-cols-2 gap-6">
                {/* BLE Beacon */}
                <div className="border-2 border-neutral-900 p-6 text-center">
                  <div className="text-4xl mb-4">📡</div>
                  <h3 className="font-bold text-foreground mb-2">Bluetooth Beacon</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isBeaconActive
                      ? "Broadcasting... Students can auto-check in"
                      : "Start beacon to enable auto check-in"}
                  </p>
                  <button
                    onClick={toggleBeacon}
                    className={`uppercase tracking-[0.2em] text-xs font-bold px-6 py-3 border-2 transition-colors ${
                      isBeaconActive
                        ? "border-accent text-accent hover:bg-accent hover:text-white"
                        : "border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950"
                    }`}
                  >
                    {isBeaconActive ? "Stop Beacon" : "Start Beacon"}
                  </button>
                </div>

                {/* QR Code */}
                <div className="border-2 border-neutral-900 p-6 text-center">
                  <div className="text-4xl mb-4">📷</div>
                  <h3 className="font-bold text-foreground mb-2">Class QR Code</h3>
                  <p className="text-sm text-muted-foreground mb-4">Display for students to scan</p>
                  <div className="bg-white p-4 inline-block mb-4">
                    <div className="w-32 h-32 bg-neutral-200 flex items-center justify-center">
                      <span className="text-xs text-neutral-400">QR CODE</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Class QR: ${generateClassQR()}`)}
                    className="block w-full uppercase tracking-[0.2em] text-xs font-bold px-6 py-3 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
                  >
                    Generate New QR
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CLASSES TAB */}
        {activeTab === "classes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">Class Schedule</h2>
              <button
                onClick={() => setShowCreateClassModal(true)}
                className="uppercase tracking-[0.2em] text-xs font-bold px-6 py-3 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
              >
                + Create Class
              </button>
            </div>

            <div className="grid gap-4">
              {classes.length === 0 ? (
                <div className="border-2 border-neutral-900 p-8 text-center text-muted-foreground">
                  No classes created yet. Click "Create Class" to add your first class.
                </div>
              ) : (
                classes.map((cls) => (
                  <div key={cls.id} className="border-2 border-neutral-900 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground">{cls.name}</h3>
                        <p className="text-muted-foreground mt-1">{cls.schedule}</p>
                        {cls.location && (
                          <p className="text-sm text-accent mt-1">📍 {cls.location}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Instructor: {cls.instructorName} • Max: {cls.maxStudents} students
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedClass(cls.id)}
                        className="text-sm underline text-muted-foreground hover:text-foreground"
                      >
                        Select for Check-in
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div className="border-2 border-neutral-900">
            <div className="p-6 border-b-2 border-neutral-900 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">Today's Attendance</h2>
              <button
                onClick={fetchTodayCheckIns}
                className="text-sm text-muted-foreground underline"
              >
                Refresh
              </button>
            </div>

            <div className="divide-y-2 divide-neutral-900">
              {students.map((student) => {
                const checkIn = todayCheckIns.find((c) => c.studentId === student.id);
                return (
                  <div key={student.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 ${
                          checkIn?.status === "present"
                            ? "bg-green-500"
                            : checkIn?.status === "late"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-bold text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.beltRank} • {checkIn?.method?.toUpperCase() || "Not checked in"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {checkIn && (
                        <button
                          onClick={() => handleRemoveCheckIn(student.id)}
                          className="text-sm text-accent hover:underline"
                        >
                          Remove
                        </button>
                      )}
                      <button
                        onClick={() => openCorrectionModal(student)}
                        className="text-sm underline text-muted-foreground hover:text-foreground"
                      >
                        {checkIn ? "Edit" : "Mark Present"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Create Class Modal */}
        {showCreateClassModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-background border-2 border-neutral-900 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6">Create New Class</h3>
              
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Class Name *</label>
                  <input
                    type="text"
                    required
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g., Kids BJJ Beginners"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Schedule *</label>
                  <input
                    type="text"
                    required
                    value={classForm.schedule}
                    onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g., Mon/Wed/Fri 18:00-19:30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Describe days and times</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={classForm.location}
                    onChange={(e) => setClassForm({ ...classForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g., Main Dojo, Park Location, School Gym"
                  />
                  <p className="text-xs text-muted-foreground mt-1">For roaming classes or multiple locations</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Max Students</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={classForm.maxStudents}
                    onChange={(e) => setClassForm({ ...classForm, maxStudents: parseInt(e.target.value) || 20 })}
                    className="w-full px-4 py-3 bg-surface border-2 border-neutral-900 text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateClassModal(false)}
                    className="flex-1 uppercase tracking-[0.2em] text-xs font-bold px-6 py-3 border-2 border-neutral-900 text-foreground hover:bg-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createClassLoading}
                    className="flex-1 uppercase tracking-[0.2em] text-xs font-bold px-6 py-3 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-50 transition-colors"
                  >
                    {createClassLoading ? "Creating..." : "Create Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Correction Modal */}
        {showCorrectionModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-background border-2 border-neutral-900 p-8 max-w-md w-full">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                {todayCheckIns.find((c) => c.studentId === selectedStudent.id) ? "Edit" : "Mark"} Attendance
              </h3>
              <p className="text-muted-foreground mb-6">{selectedStudent.name}</p>

              <div className="space-y-3 mb-6">
                {(["present", "absent", "late"] as const).map((status) => (
                  <label
                    key={status}
                    className={`flex items-center justify-center p-4 border-2 cursor-pointer transition-colors ${
                      correctionStatus === status
                        ? "border-accent bg-accent/10"
                        : "border-neutral-900 hover:bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={correctionStatus === status}
                      onChange={(e) => setCorrectionStatus(e.target.value as any)}
                      className="sr-only"
                    />
                    <span className="uppercase tracking-widest font-bold text-foreground">
                      {status}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCorrectionModal(false)}
                  className="flex-1 uppercase tracking-[0.2em] text-xs font-bold px-6 py-3 border-2 border-neutral-900 text-foreground hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCorrection}
                  className="flex-1 uppercase tracking-[0.2em] text-xs font-bold px-6 py-3 border-2 border-neutral-900 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for removing check-ins
async function handleRemoveCheckIn(studentId: string) {
  if (!confirm("Remove this check-in?")) return;
  
  try {
    const response = await fetch("/api/checkin/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    
    if (response.ok) {
      window.location.reload();
    }
  } catch (error) {
    alert("Failed to remove check-in");
  }
}
