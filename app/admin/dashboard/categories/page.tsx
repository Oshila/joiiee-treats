"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { getProducts } from "@/app/services/productService";
import { Plus, Tag } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<
    { name: string; count: number; products: any[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getProducts();
      if (res.success) {
        const map = new Map<string, any[]>();
        res.products.forEach((p) => {
          const c = (p.category || "uncategorized").toLowerCase();
          if (!map.has(c)) map.set(c, []);
          map.get(c)!.push(p);
        });
        setCategories(
          Array.from(map.entries())
            .map(([name, products]) => ({
              name,
              count: products.length,
              products,
            }))
            .sort((a, b) => b.count - a.count)
        );
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Categories</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <Link
          href="/admin/dashboard/products"
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Info note */}
      <div className="border border-[var(--border)] rounded-lg p-4 mb-6 bg-[var(--hover)]">
        <p className="text-xs text-[var(--muted)]">
          Categories are assigned when you create or edit a product. To add a
          new category, type it into the category field on the product form.
        </p>
      </div>

      {/* Categories grid */}
      {loading ? (
        <div className="border border-[var(--border)] rounded-lg p-12 text-center">
          <p className="text-sm text-[var(--muted)]">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-[var(--border)] rounded-lg p-12 text-center">
          <Tag size={32} className="mx-auto text-[var(--muted)] mb-3" />
          <p className="text-sm text-[var(--muted)] mb-4">
            No categories yet. Add a product to create one.
          </p>
          <Link
            href="/admin/dashboard/products"
            className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors"
          >
            <Plus size={14} />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/admin/dashboard/products?category=${encodeURIComponent(
                c.name
              )}`}
              className="border border-[var(--border)] rounded-lg p-5 hover:bg-[var(--hover)] hover:border-white transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <Tag size={18} className="text-[var(--muted)]" />
                <span className="text-xs text-[var(--muted)] group-hover:text-white transition-colors">
                  {c.count} {c.count === 1 ? "product" : "products"}
                </span>
              </div>
              <h3 className="text-base font-medium text-white capitalize mb-1">
                {c.name}
              </h3>
              <p className="text-xs text-[var(--muted)] line-clamp-2">
                {c.products
                  .slice(0, 3)
                  .map((p: any) => p.name)
                  .join(" · ")}
                {c.products.length > 3 &&
                  ` · +${c.products.length - 3} more`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}