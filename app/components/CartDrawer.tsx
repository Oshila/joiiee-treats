"use client";

import Link from "next/link";
import { useCart } from "@/app/providers/CartProvider";
import { X, Minus, Plus, Trash2 } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col shadow-2xl border-l border-neutral-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-white">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[15px] font-semibold text-black">Cart</h2>
            <span className="text-[13px] text-neutral-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-black hover:bg-neutral-100 rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-white">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-[14px] text-neutral-600 mb-4">
                Your cart is empty
              </p>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="text-[13px] font-medium text-black underline underline-offset-4"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="p-5 flex gap-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0 border border-neutral-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-black line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[12px] text-neutral-500 mt-0.5">
                          {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-md self-start transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>

                    {/* Qty + Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          className="p-1.5 text-black hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="text-[13px] font-medium text-black w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          className="p-1.5 text-black hover:bg-neutral-100 transition-colors disabled:opacity-30"
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                      <span className="text-[14px] font-semibold text-black">
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
          <div className="border-t border-neutral-200 p-5 space-y-3 bg-white">
            <div className="flex justify-between text-[14px]">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold text-black">
                ₦{total.toLocaleString()}
              </span>
            </div>
            <p className="text-[12px] text-neutral-500">
              Delivery calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-black text-white py-3.5 text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}