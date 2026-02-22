"use client";

import { useState } from "react";
import CrossmintPayment from "@/components/CrossmintPayment";

const MEMBERSHIP_PLANS = [
  {
    id: "monthly",
    name: "Monthly Membership",
    price: 99,
    description: "Unlimited classes, monthly billing",
  },
  {
    id: "quarterly",
    name: "Quarterly Membership",
    price: 249,
    description: "Save $48 — 3 months unlimited",
  },
  {
    id: "annual",
    name: "Annual Membership",
    price: 899,
    description: "Save $289 — Best value!",
  },
  {
    id: "dropin",
    name: "Drop-in Class",
    price: 25,
    description: "Single class access",
  },
];

export default function PaymentsPage() {
  const [selectedPlan, setSelectedPlan] = useState(MEMBERSHIP_PLANS[0]);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="p-6 bg-green-900/30 rounded-lg border border-green-700">
            <h2 className="text-2xl font-bold text-green-400 mb-2">✅ Payment Successful!</h2>
            <p className="text-gray-300">Thank you for your purchase.</p>
            {orderId && (
              <p className="text-sm text-gray-400 mt-2">Order ID: {orderId}</p>
            )}
          </div>
          
          <a
            href="/"
            className="block w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-center"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-red-500">Dojo Membership</h1>
          <p className="text-gray-400 mt-2">Choose your plan</p>
        </header>

        <div className="space-y-4 mb-8">
          {MEMBERSHIP_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`w-full p-4 rounded-lg text-left transition ${
                selectedPlan.id === plan.id
                  ? "bg-red-600"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{plan.name}</p>
                  <p className="text-sm opacity-80">{plan.description}</p>
                </div>
                <span className="text-2xl font-bold">${plan.price}</span>
              </div>
            </button>
          ))}
        </div>

        <CrossmintPayment
          amount={selectedPlan.price}
          description={selectedPlan.name}
          onSuccess={(id) => {
            setOrderId(id);
            setPaymentComplete(true);
          }}
        />
      </div>
    </div>
  );
}
