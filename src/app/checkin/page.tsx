"use client";

import QRScanner from "@/components/QRScanner";

export default function CheckInPage() {
  // For now, using a hardcoded dojo ID
  // In production, this would come from auth/session
  const dojoId = "demo-dojo-id";

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-md mx-auto pt-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Quick Check-in</h1>
          <p className="text-gray-400 mt-2">Scan student QR code to check in</p>
        </header>

        <QRScanner dojoId={dojoId} />

        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Hold student QR code 6-12 inches from camera</li>
            <li>Wait for green confirmation</li>
            <li>Scanner will reset automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
