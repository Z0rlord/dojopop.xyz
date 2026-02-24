"use client";

import { useState, useRef } from "react";
import VoiceAI from "@/components/VoiceAI";

// Toggle this to enable/disable Voice AI feature
const VOICE_AI_ENABLED = true;

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "tokens">("overview");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock student data - in production this comes from auth/API
  const studentId = "stu_demo_001";
  const studentName = "Tom Jones";
  const beltRank = "Blue Belt";
  const stripes = 3;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("avatar", file);

      const response = await fetch("/api/student/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setAvatar(data.avatar);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <header className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleAvatarClick}
              className="relative w-16 h-16 rounded-full bg-surface border-2 border-dashed border-surface-border hover:border-primary transition flex items-center justify-center overflow-hidden"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">📷</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-xs">Uploading...</span>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div>
              <h1 className="text-2xl font-bold text-foreground">{studentName}</h1>
              <p className="text-muted-foreground">{beltRank} • {stripes} {stripes === 1 ? 'Stripe' : 'Stripes'}</p>
            </div>
          </div>
        </header>

        <nav className="flex gap-2 mb-6">
          {(["overview", "history", "tokens"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition capitalize ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-foreground hover:bg-background"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-xl text-center border border-surface-border">
                <p className="text-3xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
              <div className="p-4 bg-surface rounded-xl text-center border border-surface-border">
                <p className="text-3xl font-bold text-accent">5</p>
                <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
              </div>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-surface-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">DOJO Balance</p>
                  <p className="text-2xl font-bold">245 DOJO</p>
                </div>
                <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg text-sm font-medium transition">
                  Redeem
                </button>
              </div>
            </div>

            {VOICE_AI_ENABLED && <VoiceAI studentId={studentId} enabled={VOICE_AI_ENABLED} />}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">Recent Check-ins</h2>
            {[
              { date: "2026-02-19", class: "Adult BJJ" },
              { date: "2026-02-17", class: "Adult BJJ" },
              { date: "2026-02-15", class: "Muay Thai" },
            ].map((checkIn, i) => (
              <div key={i} className="p-3 bg-surface rounded-xl flex justify-between border border-surface-border">
                <span className="text-foreground">{checkIn.class}</span>
                <span className="text-muted-foreground">{checkIn.date}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-xl border border-surface-border">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-4xl font-bold">245 DOJO</p>
            </div>
            
            <div className="p-4 bg-surface rounded-xl border border-surface-border">
              <p className="text-sm text-muted-foreground mb-2">Recent Earnings</p>
              <div className="space-y-2">
                {[
                  { amount: 1, reason: "Check-in", date: "Today" },
                  { amount: 5, reason: "Streak bonus", date: "Yesterday" },
                  { amount: 1, reason: "Check-in", date: "2 days ago" },
                ].map((tx, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">+{tx.amount} {tx.reason}</span>
                    <span className="text-muted-foreground">{tx.date}</span>
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
