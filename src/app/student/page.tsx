"use client";

import { useState } from "react";
import VoiceAI from "@/components/VoiceAI";

// Toggle this to enable/disable Voice AI feature
const VOICE_AI_ENABLED = true;

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "tokens">("overview");
  
  // Mock student data - in production this comes from auth/API
  const studentId = "stu_demo_001";
  const studentName = "Jan Kowalski";

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-red-500">Welcome, {studentName}</h1>
          <p className="text-gray-400">Your Dojo Pop dashboard</p>
        </header>

        <nav className="flex gap-4 mb-6 border-b border-gray-800 pb-4">
          {(["overview", "history", "tokens"] as const).map((tab) => (
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

        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900 rounded-lg text-center">
                <p className="text-3xl font-bold text-red-500">12</p>
                <p className="text-sm text-gray-400">This Month</p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg text-center">
                <p className="text-3xl font-bold text-yellow-500">5</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
            </div>

            <div className="p-4 bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">DOJO Balance</p>
                  <p className="text-2xl font-bold">245 DOJO</p>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm">
                  Redeem
                </button>
              </div>
            </div>

            {/* Voice AI - Toggle with VOICE_AI_ENABLED constant */}
            <VoiceAI studentId={studentId} enabled={VOICE_AI_ENABLED} />
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            <h2 className="font-semibold">Recent Check-ins</h2>
            {[
              { date: "2026-02-19", class: "Adult BJJ" },
              { date: "2026-02-17", class: "Adult BJJ" },
              { date: "2026-02-15", class: "Muay Thai" },
            ].map((checkIn, i) => (
              <div key={i} className="p-3 bg-gray-900 rounded-lg flex justify-between">
                <span>{checkIn.class}</span>
                <span className="text-gray-500">{checkIn.date}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-400">Current Balance</p>
              <p className="text-4xl font-bold">245 DOJO</p>
            </div>
            
            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Recent Earnings</p>
              <div className="space-y-2">
                {[
                  { amount: 1, reason: "Check-in", date: "Today" },
                  { amount: 5, reason: "Streak bonus", date: "Yesterday" },
                  { amount: 1, reason: "Check-in", date: "2 days ago" },
                ].map((tx, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>+{tx.amount} {tx.reason}</span>
                    <span className="text-gray-500">{tx.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
