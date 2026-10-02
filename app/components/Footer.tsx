import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="text-base font-semibold tracking-tight mb-3">
              Shop With Me
            </p>
            <p className="text-sm text-[var(--muted)] max-w-xs">
              Curated tech and accessories. Fast delivery across Nigeria.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Shop</p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/shop" className="hover:text-[var(--fg)]">All Products</Link></li>
              <li><Link href="/shop?category=tech" className="hover:text-[var(--fg)]">Tech</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-[var(--fg)]">Accessories</Link></li>
              <li><Link href="/shop?category=preorder" className="hover:text-[var(--fg)]">Pre-Order</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Help</p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/track" className="hover:text-[var(--fg)]">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--fg)]">Contact</Link></li>
              <li><Link href="/returns" className="hover:text-[var(--fg)]">Returns</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Follow</p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><a href="#" className="hover:text-[var(--fg)]">Instagram</a></li>
              <li><a href="#" className="hover:text-[var(--fg)]">Twitter</a></li>
              <li><a href="#" className="hover:text-[var(--fg)]">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-[var(--muted)]">
          <p>© {new Date().getFullYear()} Shop With Me. All rights reserved.</p>
          <Link href="/admin" className="hover:text-[var(--fg)]">Admin</Link>
        </div>
      </div>
    </footer>
  );
}