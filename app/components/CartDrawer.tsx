"use client";

import Link from "next/link";
import { useCart } from "@/app/providers/CartProvider";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    itemCount,
    isOpen,
    setIsOpen,
    clearCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-black border-l border-[var(--border)] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-white" />
            <h2 className="text-base font-medium text-white">Your cart</h2>
            <span className="text-xs text-[var(--muted)]">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-[var(--muted)] hover:text-white hover:bg-[var(--hover)] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-full bg-[var(--hover)] flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-[var(--muted)]" />
              </div>
              <p className="text-sm text-white mb-1">Your cart is empty</p>
              <p className="text-xs text-[var(--muted)] mb-6">
                Add some products to get started
              </p>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-black px-5 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="p-5 flex gap-4"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className="w-20 h-20 bg-[var(--hover)] rounded-md overflow-hidden flex-shrink-0 border border-[var(--border)]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 mb-1">
                      <Link
                        href={`/product/${item.id}`}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-white line-clamp-1 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-1 text-[var(--muted)] hover:text-red-400 rounded transition-colors flex-shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <p className="text-xs text-[var(--muted)] mb-3">
                      {item.size}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-[var(--border)] rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          className="p-2 text-white hover:bg-[var(--hover)] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="p-2 text-white hover:bg-[var(--hover)] disabled:opacity-40 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Subtotal</span>
                <span className="text-white font-medium">
                  ₦{total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Delivery</span>
                <span className="text-[var(--muted)]">
                  Quoted after order
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-gray-500 text-black py-3.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors"
            >
              Checkout — ₦{total.toLocaleString()}
            </Link>

            <button
              onClick={() => {
                if (confirm("Clear all items from cart?")) clearCart();
              }}
              className="block w-full text-center text-xs text-[var(--muted)] hover:text-white transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}