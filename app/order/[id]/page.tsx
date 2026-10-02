"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { getOrders } from "@/app/services/orderService";

const STEPS = ["pending", "processing", "shipped", "delivered"];

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getOrders();
      if (res.success) {
        const found = res.orders.find(
          (o) => o.orderNumber.toLowerCase() === id.toLowerCase()
        );
        if (found) setOrder(found);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-sm text-[var(--muted)]">
          Loading...
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-sm text-[var(--muted)] mb-4">Order not found</p>
          <Link href="/track" className="text-sm underline">
            Try again
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const stepIndex = STEPS.indexOf(order.status);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-2">
          Order
        </p>
        <h1 className="text-2xl font-medium mb-8">{order.orderNumber}</h1>

        <div className="border border-[var(--border)] rounded-lg p-6 mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4">
            Status
          </p>
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      i <= stepIndex ? "bg-black" : "bg-[var(--border)]"
                    }`}
                  />
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-2 text-center">
                    {s}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 ${
                      i < stepIndex ? "bg-black" : "bg-[var(--border)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          {order.status === "cancelled" && (
            <p className="text-xs text-red-600 mt-4">This order was cancelled.</p>
          )}
        </div>

        <div className="border border-[var(--border)] rounded-lg p-6 mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4">
            Items
          </p>
          <div className="space-y-4">
            {order.items.map((i: any, idx: number) => (
              <div key={idx} className="flex gap-3 text-sm">
                <div className="w-14 h-14 bg-[var(--hover)] rounded-md overflow-hidden flex-shrink-0">
                  <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {i.size} x{i.quantity}
                  </p>
                </div>
                <span>₦{(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-[var(--border)] space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Delivery</span>
              <span>
                {order.deliveryFee === 0 ? "Free" : `₦${order.deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[var(--border)] font-medium">
              <span>Total</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border border-[var(--border)] rounded-lg p-6">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4">
            Delivery Details
          </p>
          <div className="text-sm space-y-1">
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-[var(--muted)]">{order.customer.phone}</p>
            <p className="text-[var(--muted)]">
              {order.customer.address}, {order.customer.city}, {order.customer.state}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}