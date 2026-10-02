"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/products", label: "Products" },
  { href: "/admin/dashboard/orders", label: "Orders" },
  { href: "/admin/dashboard/categories", label: "Categories" },
  { href: "/admin/dashboard/customers", label: "Customers" },
  { href: "/admin/dashboard/settings", label: "Settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  const logout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="w-56 border-r border-neutral-200 bg-white flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <Link href="/admin/dashboard" className="text-sm font-medium">
            Shop With Me
          </Link>
          <p className="text-[10px] tracking-wider uppercase text-[var(--muted)] mt-1">
            Admin
          </p>
        </div>
        <nav className="flex-1 p-2 bg-white">
          {nav.map((n) => {
            const active =
              n.href === "/admin/dashboard"
                ? pathname === n.href
                : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  backgroundColor: active ? "#000000" : "transparent",
                  color: active ? "#ffffff" : "#525252",
                }}
                className="block px-3 py-2 text-sm rounded-md mb-1 transition-colors hover:bg-neutral-100 hover:text-black"
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-neutral-200 bg-white">
          <Link
            href="/"
            className="block px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-black rounded-md mb-1 transition-colors"
          >
            View Store
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-black rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}