"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { getProducts } from "@/app/services/productService";
import { getOrders } from "@/app/services/orderService";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    pending: 0,
    soldOut: 0,
  });

  useEffect(() => {
    (async () => {
      const [p, o] = await Promise.all([getProducts(), getOrders()]);
      const products = p.success ? p.products : [];
      const orders = o.success ? o.orders : [];
      setStats({
        products: products.length,
        orders: orders.length,
        revenue: orders
          .filter((x: any) => x.paymentStatus === "paid")
          .reduce((s: number, x: any) => s + (x.total || 0), 0),
        pending: orders.filter((x: any) => x.status === "pending").length,
        soldOut: products.filter((x) => (x.stock || 0) <= 0).length,
      });
    })();
  }, []);

  const cards = [
    { label: "Revenue", value: `₦${stats.revenue.toLocaleString()}` },
    { label: "Orders", value: stats.orders },
    { label: "Pending Orders", value: stats.pending },
    { label: "Products", value: stats.products },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Overview</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Store performance at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div
            key={c.label}
            className="border border-[var(--border)] rounded-lg p-5"
          >
            <p className="text-xs tracking-wider uppercase text-[var(--muted)] mb-2">
              {c.label}
            </p>
            <p className="text-2xl font-medium">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/dashboard/products"
          className="border border-[var(--border)] rounded-lg p-6 hover:bg-[var(--hover)] transition-colors"
        >
          <p className="text-sm font-medium mb-1">Manage Products</p>
          <p className="text-xs text-[var(--muted)]">
            Add, edit, and remove products from your store
          </p>
        </Link>
        <Link
          href="/admin/dashboard/orders"
          className="border border-[var(--border)] rounded-lg p-6 hover:bg-[var(--hover)] transition-colors"
        >
          <p className="text-sm font-medium mb-1">Manage Orders</p>
          <p className="text-xs text-[var(--muted)]">
            View orders and update their status
          </p>
        </Link>
      </div>

      {stats.soldOut > 0 && (
        <div className="mt-8 border border-[var(--border)] rounded-lg p-5">
          <p className="text-sm">
            <span className="font-medium">{stats.soldOut}</span> product
            {stats.soldOut > 1 ? "s are" : " is"} out of stock
          </p>
          <Link
            href="/admin/dashboard/products"
            className="text-xs underline mt-2 inline-block"
          >
            Update stock
          </Link>
        </div>
      )}
    </AdminLayout>
  );
}