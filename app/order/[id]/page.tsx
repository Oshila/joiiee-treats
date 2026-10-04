"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { getOrders } from "@/app/services/orderService";
import { Check, Package, Truck, Home, XCircle } from "lucide-react";

const STEPS = [
  { id: "pending", label: "Order placed", icon: Check },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: Home },
];

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
          (o) => o.orderNumber?.toLowerCase() === id.toLowerCase()
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
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-sm text-[var(--muted)]">Loading order...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-sm text-[var(--muted)] mb-4">
            Order not found. Check your order number.
          </p>
          <Link
            href="/track"
            className="inline-block bg-gray-500 text-black px-6 py-3 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors"
          >
            Track another order
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const cancelled = order.status === "cancelled";
  const currentIndex = STEPS.findIndex((s) => s.id === order.status);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/track"
          className="inline-block text-xs text-[var(--muted)] hover:text-white mb-6 transition-colors"
        >
          ← Track another order
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              Order
            </p>
            <h1 className="text-2xl font-medium text-white">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-[var(--muted)] mt-1">
              Placed on{" "}
              {order.createdAt?.toDate?.()
                ? order.createdAt.toDate().toLocaleString()
                : "-"}
            </p>
          </div>
          <Link
            href="/shop"
            className="bg-gray-500 text-black px-4 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors text-center sm:w-auto"
          >
            Continue shopping
          </Link>
        </div>

        {/* Status card */}
        <div className="border border-[var(--border)] rounded-lg p-6 mb-6">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-5">
            Status
          </p>

          {cancelled ? (
            <div className="flex items-center gap-3">
              <XCircle size={20} className="text-red-400" />
              <p className="text-sm text-red-400 font-medium">
                This order was cancelled
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {STEPS.map((s, i) => {
                const done = i <= currentIndex;
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                          done
                            ? "bg-gray-500 text-black border-white"
                            : "bg-transparent text-[var(--muted)] border-[var(--border)]"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            i < currentIndex ? "bg-gray-500" : "bg-[var(--border)]"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-2">
                      <p
                        className={`text-sm font-medium ${
                          done ? "text-white" : "text-[var(--muted)]"
                        }`}
                      >
                        {s.label}
                      </p>
                      {i === currentIndex && (
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          Current
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="border border-[var(--border)] rounded-lg p-6 mb-6">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-5">
            Items
          </p>
          <div className="space-y-4">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-16 bg-[var(--hover)] rounded-md overflow-hidden flex-shrink-0 border border-[var(--border)]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {item.size} · Quantity {item.quantity}
                  </p>
                </div>
                <span className="text-sm text-white whitespace-nowrap">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--border)] mt-5 pt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="text-white">
                ₦{order.subtotal?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Delivery</span>
              <span className="text-[var(--muted)]">Quoted separately</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--border)] font-medium">
              <span className="text-white">Total paid</span>
              <span className="text-white">
                ₦{order.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="border border-[var(--border)] rounded-lg p-6 mb-6">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-4">
            Delivery details
          </p>
          <div className="text-sm space-y-1">
            <p className="text-white font-medium">{order.customer?.name}</p>
            <p className="text-[var(--muted)]">{order.customer?.phone}</p>
            <p className="text-[var(--muted)]">{order.customer?.email}</p>
            <p className="text-[var(--muted)] mt-2">
              {order.customer?.address}, {order.customer?.city},{" "}
              {order.customer?.state}
            </p>
          </div>
        </div>

        {/* Help */}
        <div className="border border-[var(--border)] rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-white font-medium mb-1">
              Need help with this order?
            </p>
            <p className="text-xs text-[var(--muted)]">
              We usually respond within a few hours.
            </p>
          </div>
          <a
            href={`https://wa.me/2349166693315?text=${encodeURIComponent(
              `Hi, I'm checking on my order ${order.orderNumber}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-500 text-black px-5 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors text-center"
          >
            Contact support
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}