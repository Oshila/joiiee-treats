"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { CartDrawer } from "@/app/components/CartDrawer";
import { ProductCard } from "@/app/components/ProductCard";
import { getProduct, getProducts } from "@/app/services/productService";
import { useCart } from "@/app/providers/CartProvider";
import { Minus, Plus, ArrowLeft } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await getProduct(id);
      if (res.success && res.product) {
        setProduct(res.product);
        setSize(res.product.sizes?.[0] || "Default");
        const all = await getProducts();
        if (all.success) {
          setRelated(
            all.products
              .filter((p) => p.id !== id && p.category === res.product!.category)
              .slice(0, 4)
          );
        }
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-sm text-[var(--muted)]">Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-sm text-[var(--muted)] mb-4">Product not found</p>
          <Link href="/shop" className="text-sm underline text-white">
            Back to shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    if (soldOut) return;
    addItem({
      id: product.id,
      name: product.name,
      size,
      price: product.price,
      image: product.images?.[0] || "/placeholder.png",
      stock: product.stock,
    });
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-[var(--hover)] rounded-lg overflow-hidden mb-3 border border-[var(--border)]">
              <img
                src={product.images?.[activeImage] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border ${
                      activeImage === i ? "border-white" : "border-[var(--border)]"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-2">
              {product.category}
            </p>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-3 text-white">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-medium text-white">
                ₦{product.price.toLocaleString()}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-[var(--muted)] line-through">
                  ₦{product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
              {product.description}
            </p>

            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-medium mb-2 text-white">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`text-xs px-3 py-2 rounded-md border transition-colors ${
                        size === s
                          ? "bg-white text-black border-white"
                          : "border-[var(--border)] text-white hover:bg-[var(--hover)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs font-medium mb-2 text-white">Quantity</p>
              <div className="inline-flex items-center border border-[var(--border)] rounded-md">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2.5 text-white hover:bg-[var(--hover)] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm text-white">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="p-2.5 text-white hover:bg-[var(--hover)] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              {product.stock > 0 && product.stock < 10 && (
                <p className="text-xs text-[var(--muted)] mt-2">
                  Only {product.stock} left in stock
                </p>
              )}
            </div>

            <button
              onClick={() => {
                for (let i = 0; i < qty; i++) handleAdd();
              }}
              disabled={soldOut}
              className="w-full bg-white text-black py-3.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {soldOut ? "Sold Out" : "Add to Cart"}
            </button>

            <p className="text-xs text-[var(--muted)] mt-3">
              {product.isPreorder
                ? "This is a pre-order item. Ships in 7-14 days."
                : "Delivery quoted separately after order is placed"}
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[var(--border)]">
            <h2 className="text-xl font-medium text-white mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}