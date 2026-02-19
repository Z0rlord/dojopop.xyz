"use client";

import { useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "pl">("en");

  const t = {
    en: {
      title: "Dojo Pop",
      subtitle: "Proof of Practice",
      tagline: "Track your martial arts journey",
      studentLogin: "Student Login",
      instructorLogin: "Instructor Login",
      checkIn: "Quick Check-in",
    },
    pl: {
      title: "Dojo Pop",
      subtitle: "Dowód Praktyki",
      tagline: "Śledź swoją drogę sztuk walki",
      studentLogin: "Logowanie Ucznia",
      instructorLogin: "Logowanie Instruktora",
      checkIn: "Szybkie Check-in",
    },
  };

  const current = t[language];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 rounded ${
            language === "en" ? "bg-red-600" : "bg-gray-800"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("pl")}
          className={`px-3 py-1 rounded ${
            language === "pl" ? "bg-red-600" : "bg-gray-800"
          }`}
        >
          PL
        </button>
      </div>

      <main className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-red-500">{current.title}</h1>
          <p className="text-2xl text-gray-400">{current.subtitle}</p>
          <p className="text-gray-500">{current.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <a
            href="/checkin"
            className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition text-center block"
          >
            {current.checkIn}
          </a>

          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              {current.studentLogin}
            </button>
            <a
              href="/instructor"
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center block"
            >
              {current.instructorLogin}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
