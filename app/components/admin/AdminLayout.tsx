"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!ready) return null;

  const logout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  const isActive = (href: string) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex bg-white text-[var(--fg)]">

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-3 bg-white border-b border-[var(--border)]">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 text-[var(--fg)] hover:bg-[var(--hover)] rounded-md"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-medium">Admin</span>
        <div className="w-8" />
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-56 flex-shrink-0
          bg-white border-r border-[var(--border)] flex flex-col
          transform transition-transform duration-200 ease-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--border)]">
          <div>
            <Link href="/admin/dashboard" className="text-sm font-medium">
              Shop With Me
            </Link>
            <p className="text-[10px] tracking-wider uppercase text-[var(--muted)] mt-1">
              Admin
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-1.5 text-[var(--muted)] hover:bg-[var(--hover)] rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`block px-3 py-2 text-sm rounded-md mb-1 transition-colors ${
                  active
                    ? "bg-black text-white"
                    : "text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)]"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-[var(--border)]">
          <Link
            href="/"
            className="block px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--hover)] rounded-md mb-1"
          >
            View Store
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--hover)] rounded-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
