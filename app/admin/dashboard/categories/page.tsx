"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { getProducts } from "@/app/services/productService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await getProducts();
    if (res.success) {
      const map = new Map<string, number>();
      res.products.forEach((p) => {
        const c = p.category || "uncategorized";
        map.set(c, (map.get(c) || 0) + 1);
      });
      setCategories(
        Array.from(map.entries()).map(([name, count]) => ({ name, count }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Categories</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Categories are assigned when adding products
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading...</p>
      ) : categories.length === 0 ? (
        <div className="border border-[var(--border)] rounded-lg p-12 text-center">
          <p className="text-sm text-[var(--muted)]">
            No categories yet. Add products to create categories.
          </p>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {categories.map((c) => (
                <tr key={c.name}>
                  <td className="px-4 py-3 capitalize font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}