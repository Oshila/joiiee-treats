"use client";

import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { MessageCircle, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const whatsapp = "https://wa.me/2349166693315";

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
            Contact
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white mb-4">
            Get in touch
          </h1>
          <p className="text-[var(--muted)] max-w-xl leading-relaxed">
            Questions about an order, sizing, or a pre-order? Reach us directly on WhatsApp — that's the fastest way to get a response.
          </p>
        </div>

        {/* WhatsApp card */}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-[var(--border)] rounded-lg p-6 mb-6 hover:border-white transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-md bg-[var(--hover)] flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="text-base font-medium text-white">WhatsApp</p>
                <span className="text-[10px] uppercase tracking-wider text-green-400 border border-green-900 bg-green-950 px-2 py-0.5 rounded-full">
                  Fastest
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-2">
                Chat with us directly about orders, products, or anything else.
              </p>
              <p className="text-sm text-white font-medium">
                +234 916 669 3315
              </p>
            </div>
          </div>
        </a>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="border border-[var(--border)] rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-[var(--hover)] flex items-center justify-center mb-4">
              <Clock size={20} className="text-white" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Response hours</p>
            <p className="text-sm text-[var(--muted)]">
              Monday to Saturday, 9am – 7pm.
            </p>
            <p className="text-xs text-[var(--muted)] mt-2">
              Messages outside these hours are answered the next morning.
            </p>
          </div>

          <div className="border border-[var(--border)] rounded-lg p-6">
            <div className="w-11 h-11 rounded-md bg-[var(--hover)] flex items-center justify-center mb-4">
              <Mail size={20} className="text-white" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Order issues</p>
            <p className="text-sm text-[var(--muted)]">
              Have your order number ready.
            </p>
            <Link
              href="/track"
              className="inline-block text-xs text-white underline underline-offset-4 mt-2"
            >
              Track an order →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t border-[var(--border)] pt-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-6">
            Common questions
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-white mb-1.5">
                How do I track my order?
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Go to{" "}
                <Link href="/track" className="text-white underline underline-offset-4">
                  Track Order
                </Link>{" "}
                and enter your order number or the phone number you used at checkout.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-white mb-1.5">
                How is delivery priced?
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Delivery is quoted separately after you place your order. We'll reach out on WhatsApp within 24 hours with the exact fee based on your location.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-white mb-1.5">
                What about pre-order items?
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Pre-orders are marked on the product page and usually ship within 7–14 days of ordering. You'll be notified when your item is on the way.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-white mb-1.5">
                Can I change or cancel my order?
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Reach out on WhatsApp as soon as possible. If the order hasn't been dispatched, we can usually adjust it.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-white mb-1.5">
                Have a question before ordering?
              </p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Message us on WhatsApp. We're happy to help you pick the right product.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 border border-[var(--border)] rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-base font-medium text-white mb-1">
              Still need help?
            </p>
            <p className="text-sm text-[var(--muted)]">
              We usually respond within a couple of hours.
            </p>
          </div>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-500 text-black px-5 py-3 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors text-center whitespace-nowrap"
          >
            Message on WhatsApp
          </a>
        </div>

      </main>
      <Footer />
    </>
  );
}