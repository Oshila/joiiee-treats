"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { getOrders, updateOrder } from "@/app/services/orderService";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    const res = await getOrders();
    if (res.success) setOrders(res.orders);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatus = async (
    id: string,
    status: (typeof STATUSES)[number],
  ) => {
    await updateOrder(id, { status });
    load();
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Orders</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-md border capitalize transition-colors ${
              filter === s
                ? "bg-black text-white border-black"
                : "border-[var(--border)] hover:bg-[var(--hover)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-[var(--border)] rounded-lg p-12 text-center">
          <p className="text-sm text-[var(--muted)]">No orders found.</p>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p>{o.customer?.name}</p>
                    <p className="text-xs text-[var(--muted)]">{o.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3">₦{o.total?.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize text-xs">{o.paymentStatus}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleStatus(o.id, e.target.value as (typeof STATUSES)[number])
                      }
                      className="text-xs border border-[var(--border)] rounded-md px-2 py-1 capitalize"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(o)}
                      className="text-xs underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-lg border border-[var(--border)] max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                  Order
                </p>
                <p className="text-lg font-medium mt-1">{selected.orderNumber}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-sm">
                Close
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                Customer
              </p>
              <p className="text-sm">{selected.customer?.name}</p>
              <p className="text-sm text-[var(--muted)]">{selected.customer?.email}</p>
              <p className="text-sm text-[var(--muted)]">{selected.customer?.phone}</p>
              <p className="text-sm text-[var(--muted)] mt-1">
                {selected.customer?.address}, {selected.customer?.city},{" "}
                {selected.customer?.state}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                Items
              </p>
              <div className="space-y-3">
                {selected.items?.map((i: any, idx: number) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-[var(--hover)] rounded-md overflow-hidden flex-shrink-0">
                      <img src={i.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {i.size} x{i.quantity}
                      </p>
                    </div>
                    <span>₦{(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {selected.notes && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                  Notes
                </p>
                <p className="text-sm">{selected.notes}</p>
              </div>
            )}

            <div className="border-t border-[var(--border)] pt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Subtotal</span>
                <span>₦{selected.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Delivery</span>
                <span>₦{selected.deliveryFee?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₦{selected.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}