"use client";

import { useEffect, useRef, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/app/services/productService";
import { uploadImage } from "@/app/services/uploadService";
import { Plus, Search, X, Upload, Trash2, Edit3, Package } from "lucide-react";

const empty = {
  name: "",
  description: "",
  price: "",
  comparePrice: "",
  category: "",
  images: [] as string[],
  sizes: [] as string[],
  stock: "",
  featured: false,
  isPreorder: false,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [newSize, setNewSize] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await getProducts();
    if (res.success) setProducts(res.products);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort();

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openAdd = () => {
    setForm({ ...empty });
    setEditing(null);
    setNewSize("");
    setShowForm(true);
  };

  const closeForm = () => {
    setForm({ ...empty });
    setEditing(null);
    setNewSize("");
    setShowForm(false);
  };

  const handleEdit = (p: any) => {
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price?.toString() || "",
      comparePrice: p.comparePrice?.toString() || "",
      category: p.category || "",
      images: p.images || [],
      sizes: p.sizes || [],
      stock: p.stock?.toString() || "",
      featured: p.featured || false,
      isPreorder: p.isPreorder || false,
    });
    setEditing(p.id);
    setNewSize("");
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f)));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== url),
    }));
  };

  const addSize = () => {
    const s = newSize.trim();
    if (s && !form.sizes.includes(s)) {
      setForm((prev) => ({ ...prev, sizes: [...prev.sizes, s] }));
      setNewSize("");
    }
  };

  const removeSize = (s: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((x) => x !== s),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const name = form.name.trim();
    const category = form.category.trim();
    const price = Number(form.price);

    if (!name || !category || !form.price || isNaN(price) || price <= 0) {
      alert("Please fill in name, category, and a valid price.");
      return;
    }

    setSaving(true);

    const data = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description.trim(),
      price,
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      category,
      images: form.images,
      sizes: form.sizes.length ? form.sizes : ["Default"],
      colors: [],
      stock: form.stock ? Number(form.stock) : 0,
      featured: form.featured,
      isPreorder: form.isPreorder,
    };

    const res = editing
      ? await updateProduct(editing, data)
      : await addProduct(data);

    setSaving(false);

    if (res.success) {
      await load();
      closeForm();
    } else {
      alert("Save failed: " + (res.error || "Unknown error"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  const toggleStock = async (p: any) => {
    await updateProduct(p.id, { stock: p.stock > 0 ? 0 : 1 });
    load();
  };

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Products</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-[var(--hover)] border border-[var(--border)] rounded-md text-white placeholder-[var(--muted)] focus:border-white"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 text-sm bg-[var(--hover)] border border-[var(--border)] rounded-md text-white focus:border-white"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products table */}
      {loading ? (
        <div className="border border-[var(--border)] rounded-lg p-12 text-center">
          <p className="text-sm text-[var(--muted)]">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[var(--border)] rounded-lg p-12 text-center">
          <Package size={32} className="mx-auto text-[var(--muted)] mb-3" />
          <p className="text-sm text-[var(--muted)] mb-4">
            {products.length === 0
              ? "No products yet."
              : "No products match your filters."}
          </p>
          {products.length === 0 && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-[var(--hover)] hover:text-white transition-colors"
            >
              <Plus size={14} />
              Add your first product
            </button>
          )}
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-[var(--hover)]">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--hover)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--hover)] rounded-md overflow-hidden flex-shrink-0 border border-[var(--border)]">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-white line-clamp-1">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)] capitalize">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-white">
                    ₦{p.price?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {p.stock ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {p.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleStock(p)}
                        className="p-2 text-[var(--muted)] hover:text-white hover:bg-[var(--hover)] rounded-md transition-colors"
                        title={p.stock > 0 ? "Mark sold out" : "Restock"}
                      >
                        <Package size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-[var(--muted)] hover:text-white hover:bg-[var(--hover)] rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-[var(--muted)] hover:text-red-400 hover:bg-[var(--hover)] rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-in form panel */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeForm}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:max-w-lg bg-black border-l border-[var(--border)] z-50 flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-medium text-white">
                {editing ? "Edit Product" : "New Product"}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 text-[var(--muted)] hover:text-white hover:bg-[var(--hover)] rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Panel body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-5 space-y-5"
            >
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                  Product Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tech Slides"
                  className="w-full px-3 py-2.5 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                  Category *
                </label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. tech, accessories, gaming"
                  list="category-list"
                  className="w-full px-3 py-2.5 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white"
                />
                <datalist id="category-list">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2.5 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                    Compare Price
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.comparePrice}
                    onChange={(e) =>
                      setForm({ ...form, comparePrice: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2.5 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2.5 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the product"
                  rows={4}
                  className="w-full px-3 py-2.5 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-2">
                  Images
                </label>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {form.images.map((url) => (
                      <div
                        key={url}
                        className="relative aspect-square rounded-md overflow-hidden border border-[var(--border)]"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-1 right-1 bg-black/80 text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[var(--border)] px-4 py-4 text-sm text-[var(--muted)] rounded-md hover:border-white hover:text-white disabled:opacity-50 transition-colors"
                >
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Upload images"}
                </button>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-2">
                  Sizes / Variants (optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                    placeholder="e.g. Black, Pro, XL"
                    className="flex-1 px-3 py-2 bg-[var(--hover)] border border-[var(--border)] rounded-md text-sm text-white placeholder-[var(--muted)] focus:border-white"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 py-2 bg-[var(--hover)] border border-[var(--border)] text-sm text-white rounded-md hover:bg-black transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.sizes.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-2 bg-[var(--hover)] border border-[var(--border)] px-3 py-1 rounded-md text-xs text-white"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSize(s)}
                          className="text-[var(--muted)] hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                  />
                  Featured on homepage
                </label>
                <label className="flex items-center gap-3 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPreorder}
                    onChange={(e) =>
                      setForm({ ...form, isPreorder: e.target.checked })
                    }
                  />
                  Pre-order item
                </label>
              </div>
            </form>

            {/* Panel footer */}
            <div className="border-t border-[var(--border)] p-4 flex gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 px-4 py-2.5 text-sm text-[var(--muted)] border border-[var(--border)] rounded-md hover:text-white hover:border-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-white text-black rounded-md hover:bg-[var(--hover)] hover:text-white disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : editing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}