"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { CartDrawer } from "@/app/components/CartDrawer";
import { ProductCard } from "@/app/components/ProductCard";
import { getProducts } from "@/app/services/productService";

function ShopContent() {
  const params = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState(params.get("q") || "");
  const category = params.get("category") || "all";

  useEffect(() => {
    (async () => {
      const res = await getProducts();
      if (res.success) setProducts(res.products);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let list = [...products];
    if (category !== "all") {
      if (category === "preorder") list = list.filter((p) => p.isPreorder);
      else list = list.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(list);
  }, [products, category, search, sort]);

  const categories = [
    { id: "all", label: "All" },
    { id: "tech", label: "Tech" },
    { id: "accessories", label: "Accessories" },
    { id: "gaming", label: "Gaming" },
    { id: "preorder", label: "Pre-Order" },
  ];

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight mb-2">
            {category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-[var(--border)]">
          {categories.map((c) => (
            <a
              key={c.id}
              href={c.id === "all" ? "/shop" : `/shop?category=${c.id}`}
              className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
                category === c.id
                  ? "bg-black text-white border-black"
                  : "border-[var(--border)] hover:bg-[var(--hover)]"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 min-w-[200px] px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:border-black transition-colors"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:border-black transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
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
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[var(--muted)] py-20 text-center">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-sm text-[var(--muted)]">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}