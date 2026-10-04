"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { CartDrawer } from "@/app/components/CartDrawer";
import { useCart } from "@/app/providers/CartProvider";
import { saveOrder, generateOrderNumber } from "@/app/services/orderService";
import { sendOrderToTelegram } from "@/app/services/telegramService";
import { ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  // Delivery is quoted separately after the order is placed.
  const deliveryFee = 0;
  const grandTotal = total;

  useEffect(() => {
    if (items.length === 0 && !success) router.push("/shop");
  }, [items, router, success]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state
    ) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);

    const load = () => {
      const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!key) {
        setError("Payment not configured");
        setLoading(false);
        return;
      }

      const handler = window.PaystackPop.setup({
        key,
        email: form.email,
        amount: grandTotal * 100,
        currency: "NGN",
        ref: `SWM-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: "Name", variable_name: "name", value: form.name },
            { display_name: "Phone", variable_name: "phone", value: form.phone },
          ],
        },
        callback: (res: any) => handleSuccess(res),
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    };

    if (window.PaystackPop) load();
    else {
      const s = document.createElement("script");
      s.src = "https://js.paystack.co/v1/inline.js";
      s.onload = load;
      s.onerror = () => {
        setError("Failed to load payment");
        setLoading(false);
      };
      document.body.appendChild(s);
    }
  };

  const handleSuccess = async (res: any) => {
    const num = generateOrderNumber();
    setOrderNumber(num);

    const order = {
      orderNumber: num,
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
      },
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        size: i.size,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal: total,
      deliveryFee: 0,
      total: grandTotal,
      paymentReference: res.reference || "N/A",
      paymentStatus: "paid" as const,
      status: "pending" as const,
      notes: form.notes,
    };

    const saved = await saveOrder(order);
    if (saved.success) {
      try {
        await sendOrderToTelegram(order as any);
      } catch {}
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderNumber: num,
          phone: form.phone,
          timestamp: Date.now(),
        })
      );
      setSuccess(true);
      clearCart();
    } else {
      setError("Payment succeeded but order could not save. Contact support.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium mb-2 text-white">
            Order Confirmed
          </h1>
          <p className="text-sm text-neutral-400 mb-8">
            Thank you. We've received your order.
          </p>

          <div className="border border-neutral-800 rounded-lg p-6 mb-6 text-left">
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
              Order Number
            </p>
            <p className="text-xl font-medium mb-4 text-white">
              {orderNumber}
            </p>
            <p className="text-xs text-neutral-400">
              Save this number to track your order. We've also notified our team.
            </p>
          </div>

          <div className="border border-neutral-800 rounded-lg p-6 mb-8 text-left">
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-3">
              Delivery
            </p>
            <p className="text-sm text-white leading-relaxed">
              We'll contact you within 24 hours with your delivery fee based on
              your location. You can then pay the rider directly or we'll send
              a separate payment link.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/order/${orderNumber}`}
              className="inline-flex justify-center bg-gray-500 text-black px-6 py-3 text-sm font-medium rounded-md hover:bg-neutral-200 transition-colors"
            >
              View Order
            </Link>
            <Link
              href="/shop"
              className="inline-flex justify-center border border-neutral-800 text-white px-6 py-3 text-sm font-medium rounded-md hover:bg-neutral-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to shop
        </Link>

        <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">
          Checkout
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-medium mb-4 pb-3 border-b border-neutral-800 text-white">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="px-3 py-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 rounded-md text-sm focus:border-white focus:outline-none transition-colors"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="px-3 py-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 rounded-md text-sm focus:border-white focus:outline-none transition-colors"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="px-3 py-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 rounded-md text-sm focus:border-white focus:outline-none transition-colors sm:col-span-2"
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-4 pb-3 border-b border-neutral-800 text-white">
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="px-3 py-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 rounded-md text-sm focus:border-white focus:outline-none transition-colors sm:col-span-2"
                />
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="px-3 py-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 rounded-md text-sm focus:border-white focus:outline-none transition-colors"
                />
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="px-3 py-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 rounded-md text-sm focus:border-white focus:outline-none transition-colors"
                />
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Order notes (optional)"
                  className="px-3 py-2.5 border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 rounded-md text-sm focus:border-white focus:outline-none transition-colors sm:col-span-2 resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="border border-neutral-800 rounded-lg p-5 sticky top-24 bg-black">
              <h2 className="text-sm font-medium mb-4 text-white">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((i) => (
                  <div
                    key={`${i.id}-${i.size}`}
                    className="flex justify-between text-sm gap-3"
                  >
                    <span className="text-neutral-400 line-clamp-1">
                      {i.name} x{i.quantity}
                    </span>
                    <span className="text-white whitespace-nowrap">
                      ₦{(i.price * i.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-white">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-neutral-400">Delivery</span>
                  <span className="text-neutral-400 text-right text-xs max-w-[160px]">
                    Quoted separately after order
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-800 text-base font-medium">
                  <span className="text-white">Total</span>
                  <span className="text-white">
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-5 bg-gray-500 text-black py-3.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? "Processing..."
                  : `Pay ₦${grandTotal.toLocaleString()}`}
              </button>

              <p className="text-[10px] text-neutral-500 mt-3 text-center">
                Secure payment via Paystack
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}