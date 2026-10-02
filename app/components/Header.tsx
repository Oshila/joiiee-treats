"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/providers/CartProvider";
import { Search, ShoppingBag, Menu, X } from "lucide-react";

export function Header() {
  const { itemCount, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const nav = [
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=tech", label: "Tech" },
    { href: "/shop?category=accessories", label: "Accessories" },
    { href: "/shop?category=preorder", label: "Pre-Order" },
    { href: "/track", label: "Track Order" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Left: Brand + Nav */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-[17px] font-semibold tracking-tight text-black hover:text-black"
              >
                Shop With Me
              </Link>

              <nav className="hidden md:flex items-center gap-7">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="text-[13.5px] font-medium text-neutral-500 hover:text-black transition-colors"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="p-2.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-md transition-colors"
              >
                <Search size={18} strokeWidth={1.75} />
              </button>

              <button
                onClick={() => setIsOpen(true)}
                aria-label="Cart"
                className="relative p-2.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-md transition-colors"
              >
                <ShoppingBag size={18} strokeWidth={1.75} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 text-[10px] font-semibold bg-black text-white rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
                className="md:hidden p-2.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-md transition-colors"
              >
                {mobileOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
              </button>
            </div>

          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (search.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(search)}`;
                  }
                }}
              >
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  autoFocus
                  className="w-full px-3 py-2.5 border border-neutral-200 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black transition-colors"
                />
              </form>
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <div className="px-4 py-2 flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-medium text-neutral-600 hover:text-black transition-colors border-b border-neutral-100 last:border-0"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}