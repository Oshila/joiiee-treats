"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import {
  findOrder,
  findOrdersByPhone,
} from "@/app/services/orderService";

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);

    const q = query.trim();
    if (!q) {
      setError("Enter your order number or phone");
      setLoading(false);
      return;
    }

    // If it looks like an order number (starts with SWM-)
    if (/^swm-/i.test(q)) {
      const res = await findOrder(q, "");
      if (res.success && res.order) {
        setResults([res.order]);
      } else {
        setError("No order found with that number");
      }
      setLoading(false);
      return;
    }

    // Otherwise treat as phone
    const res = await findOrdersByPhone(q);
    if (res.success && res.orders?.length) {
      setResults(res.orders);
    } else {
      setError("No orders found with that phone number");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <h1 className="text-2xl font-medium tracking-tight mb-2 text-white">
          Track Order
        </h1>
        <p className="text-sm text-[var(--muted)] mb-8">
          Search by order number (e.g. SWM-123456) or the phone you used at checkout.
        </p>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order number or phone"
            className="flex-1 px-3 py-3 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6b7280] hover:bg-[#4b5563] text-white px-6 py-3 text-sm font-medium rounded-md disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="border border-red-800 bg-red-950 rounded-md p-4 mb-6">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
              {results.length} order{results.length !== 1 ? "s" : ""} found
            </p>
            {results.map((o) => (
              <Link
                key={o.id}
                href={`/order/${o.orderNumber}`}
                className="block border border-[var(--border)] rounded-lg p-4 hover:bg-[var(--hover)] hover:border-white transition-colors"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {o.orderNumber}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {o.createdAt?.toDate?.()
                        ? o.createdAt.toDate().toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    o.status === "delivered"
                      ? "bg-green-950 text-green-400"
                      : o.status === "cancelled"
                      ? "bg-red-950 text-red-400"
                      : "bg-[var(--hover)] text-white"
                  }`}>
                    {o.status || "pending"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--muted)]">
                    {o.items?.length || 0} items
                  </span>
                  <span className="text-white font-medium">
                    ₦{(o.total || 0).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}