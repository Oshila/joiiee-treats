"use client";

import Link from "next/link";
import { Product } from "@/app/services/productService";
import { useCart } from "@/app/providers/CartProvider";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const soldOut = product.stock <= 0;
  const defaultSize = product.sizes?.[0] || "Default";
  const image = product.images?.[0] || "/placeholder.png";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soldOut) return;
    addItem({
      id: product.id!,
      name: product.name,
      size: defaultSize,
      price: product.price,
      image,
      stock: product.stock,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-square bg-[var(--hover)] overflow-hidden rounded-lg mb-3 relative">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />
        {soldOut && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-medium tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
        {product.isPreorder && !soldOut && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-medium tracking-wider uppercase px-2 py-1">
            Pre-Order
          </div>
        )}
        {product.comparePrice && product.comparePrice > product.price && !soldOut && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-medium tracking-wider uppercase px-2 py-1">
            Sale
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm font-medium text-white line-clamp-1">
          {product.category}
        </p>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm font-medium">
            ₦{product.price.toLocaleString()}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-[var(--muted)] line-through">
              ₦{product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}