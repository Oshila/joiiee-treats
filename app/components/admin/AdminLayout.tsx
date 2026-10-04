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

  // Close drawer when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!ready) return null;

  const logout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  const isActive = (href: string) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden">

      {/* ─── Mobile top bar ─── */}
      <div className="lg:hidden sticky top-0 z-30 h-14 bg-black border-b border-[var(--border)] flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-2 text-white hover:bg-[var(--hover)] rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
        <Link href="/admin/dashboard" className="text-sm font-medium text-white">
          OnCart
        </Link>
        <div className="w-8" />
      </div>

      {/* ─── Backdrop (mobile only) ─── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70"
          aria-hidden="true"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full bg-black border-r border-[var(--border)] flex flex-col",
          "w-64 lg:w-56",
          "transition-transform duration-200 ease-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header inside sidebar */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--border)]">
          <div className="min-w-0">
            <Link
              href="/admin/dashboard"
              className="block text-sm font-medium text-white truncate"
            >
              OnCart
            </Link>
            <p className="text-[10px] tracking-wider uppercase text-[var(--muted)] mt-1">
              Admin
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-1.5 text-[var(--muted)] hover:text-white hover:bg-[var(--hover)] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-3">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={[
                  "block px-3 py-2.5 text-sm rounded-md mb-1 transition-colors",
                  active
                    ? "bg-[var(--hover)] text-white font-medium"
                    : "text-[var(--muted)] hover:bg-[var(--hover)] hover:text-white",
                ].join(" ")}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <Link
            href="/"
            className="block px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--hover)] hover:text-white rounded-md mb-1 transition-colors"
          >
            View Store
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--hover)] hover:text-white rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className="lg:ml-56 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
