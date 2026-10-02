"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { findOrder } from "@/app/services/orderService";

export default function TrackPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await findOrder(orderNumber, phone);
    if (res.success) {
      router.push(`/order/${orderNumber}`);
    } else {
      setError(res.error || "Order not found");
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-20">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Track Order</h1>
        <p className="text-sm text-[var(--muted)] mb-8">
          Enter your order number and phone to view your order.
        </p>

        <form onSubmit={handleTrack} className="space-y-4">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Order number (e.g. SWM-123456)"
            className="w-full px-3 py-3 border border-[var(--border)] rounded-md text-sm focus:border-black transition-colors"
            required
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number used at checkout"
            className="w-full px-3 py-3 border border-[var(--border)] rounded-md text-sm focus:border-black transition-colors"
            required
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-sm font-medium rounded-md hover:bg-neutral-800 disabled:bg-[var(--border)]"
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}