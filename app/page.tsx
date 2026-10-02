"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCard } from "./components/ProductCard";
import { CartDrawer } from "./components/CartDrawer";
import { getFeaturedProducts, getProducts } from "./services/productService";

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [f, a] = await Promise.all([
        getFeaturedProducts(),
        getProducts(),
      ]);
      if (f.success) setFeatured(f.products.filter((p) => p.stock > 0).slice(0, 4));
      if (a.success) setLatest(a.products.filter((p) => p.stock > 0).slice(0, 8));
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4">
                New Arrivals — 2026
              </p>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6">
                Curated essentials for modern living.
              </h1>
              <p className="text-[var(--muted)] mb-8 max-w-lg">
                Tech, accessories, and pre-order drops. Carefully selected. Delivered fast.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-black text-white px-6 py-3 text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/shop?category=preorder"
                  className="inline-flex items-center border border-[var(--border)] px-6 py-3 text-sm font-medium rounded-md hover:bg-[var(--hover)] transition-colors"
                >
                  Pre-Orders
                </Link>
              </div>
            </div>
          </div>
        </section>

        {!loading && featured.length > 0 && (
          <section className="border-b border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-2">
                    Featured
                  </p>
                  <h2 className="text-2xl font-medium tracking-tight">
                    Handpicked for you
                  </h2>
                </div>
                <Link href="/shop" className="text-sm underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-2">
                  Latest
                </p>
                <h2 className="text-2xl font-medium tracking-tight">
                  New in store
                </h2>
              </div>
              <Link href="/shop" className="text-sm underline">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-[var(--hover)] rounded-lg mb-3" />
                    <div className="h-3 bg-[var(--hover)] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[var(--hover)] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : latest.length === 0 ? (
              <p className="text-sm text-[var(--muted)] py-12 text-center">
                No products yet. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {latest.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}