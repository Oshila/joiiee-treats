"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { getOrders } from "@/app/services/orderService";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getOrders();
      if (res.success) {
        const map = new Map<string, any>();
        res.orders.forEach((o) => {
          const key = o.customer?.phone || o.customer?.email;
          if (!key) return;
          if (!map.has(key)) {
            map.set(key, {
              name: o.customer.name,
              phone: o.customer.phone,
              email: o.customer.email,
              orders: 0,
              total: 0,
            });
          }
          const c = map.get(key);
          c.orders += 1;
          c.total += o.total || 0;
        });
        setCustomers(Array.from(map.values()));
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Customers</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading...</p>
      ) : customers.length === 0 ? (
        <div className="border border-[var(--border)] rounded-lg p-12 text-center">
          <p className="text-sm text-[var(--muted)]">No customers yet.</p>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {customers.map((c, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    <p>{c.phone}</p>
                    <p className="text-xs">{c.email}</p>
                  </td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3">₦{c.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}