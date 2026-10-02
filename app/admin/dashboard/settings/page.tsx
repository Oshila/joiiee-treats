"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Shop With Me",
    email: "",
    phone: "",
    deliveryFee: "2000",
    freeDeliveryThreshold: "50000",
    announcement: "",
    ordersOpen: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("store_settings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("store_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Manage your store preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="border border-[var(--border)] rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-medium">Store Information</h2>
          <input
            value={settings.storeName}
            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            placeholder="Store name"
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-md text-sm focus:border-black"
          />
          <input
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            placeholder="Contact email"
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-md text-sm focus:border-black"
          />
          <input
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            placeholder="Contact phone"
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-md text-sm focus:border-black"
          />
        </div>

        <div className="border border-[var(--border)] rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-medium">Delivery</h2>
          <input
            type="number"
            value={settings.deliveryFee}
            onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
            placeholder="Delivery fee (₦)"
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-md text-sm focus:border-black"
          />
          <input
            type="number"
            value={settings.freeDeliveryThreshold}
            onChange={(e) =>
              setSettings({ ...settings, freeDeliveryThreshold: e.target.value })
            }
            placeholder="Free delivery threshold (₦)"
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-md text-sm focus:border-black"
          />
        </div>

        <div className="border border-[var(--border)] rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-medium">Announcement</h2>
          <textarea
            value={settings.announcement}
            onChange={(e) =>
              setSettings({ ...settings, announcement: e.target.value })
            }
            placeholder="e.g. Free delivery on orders above ₦50,000"
            rows={3}
            className="w-full px-3 py-2.5 border border-[var(--border)] rounded-md text-sm focus:border-black resize-none"
          />
        </div>

        <div className="border border-[var(--border)] rounded-lg p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.ordersOpen}
              onChange={(e) =>
                setSettings({ ...settings, ordersOpen: e.target.checked })
              }
            />
            <span className="text-sm">Accepting orders</span>
          </label>
          <p className="text-xs text-[var(--muted)] mt-2">
            When disabled, customers cannot place new orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-black text-white px-5 py-2.5 text-sm rounded-md hover:bg-neutral-800"
          >
            Save Settings
          </button>
          {saved && (
            <span className="text-xs text-green-600">Settings saved</span>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}