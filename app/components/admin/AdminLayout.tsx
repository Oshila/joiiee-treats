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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  // Close sidebar whenever route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (!ready) return null;

  const logout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-neutral-800 bg-black">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-2 text-white hover:bg-neutral-900 rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
        <Link href="/admin/dashboard" className="text-sm font-medium">
          Shop With Me
        </Link>
        <div className="w-8" />
      </div>

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-black border-r border-neutral-800
          flex flex-col
          transform transition-transform duration-200 ease-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-800">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-white"
            >
              Shop With Me
            </Link>
            <p className="text-[10px] tracking-wider uppercase text-neutral-500 mt-1">
              Admin
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`block px-3 py-2.5 text-sm rounded-md mb-1 transition-colors ${
                  active
                    ? "bg-white text-black font-medium"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-neutral-800">
          <Link
            href="/"
            className="block px-3 py-2.5 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white rounded-md mb-1 transition-colors"
          >
            View Store
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2.5 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
