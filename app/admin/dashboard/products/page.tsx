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
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));
  };

  const addSize = () => {
    const s = newSize.trim();
    if (s && !form.sizes.includes(s)) {
      setForm((prev) => ({ ...prev, sizes: [...prev.sizes, s] }));
      setNewSize("");
    }
  };

  const removeSize = (s: string) => {
    setForm((prev) => ({ ...prev, sizes: prev.sizes.filter((x) => x !== s) }));
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

    let res;
    if (editing) {
      res = await updateProduct(editing, data);
    } else {
      res = await addProduct(data);
    }

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} in your store
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openAdd}
            className="bg-black text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
          >
            Add Product
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-neutral-200 rounded-lg p-6 mb-8 space-y-4 bg-white"
        >
          <h2 className="text-base font-medium">
            {editing ? "Edit Product" : "New Product"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Product Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tech Slides"
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Category
              </label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. tech, accessories, gaming"
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Price (₦)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Compare Price (optional)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the product"
              rows={4}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-2">
              Images
            </label>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.images.map((url) => (
                  <div
                    key={url}
                    className="relative w-20 h-20 rounded-md overflow-hidden border border-neutral-200"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-black/80 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      ×
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
              className="border border-neutral-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-2">
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
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none"
              />
              <button
                type="button"
                onClick={addSize}
                className="border border-neutral-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-50 transition-colors"
              >
                Add
              </button>
            </div>
            {form.sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.sizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 border border-neutral-300 px-3 py-1 rounded-md text-xs text-black"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSize(s)}
                      className="text-neutral-500 hover:text-black"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPreorder}
                onChange={(e) => setForm({ ...form, isPreorder: e.target.checked })}
              />
              Pre-order item
            </label>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : editing ? "Update Product" : "Save Product"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="border border-neutral-300 px-5 py-2.5 text-sm font-medium rounded-md hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="border border-neutral-200 rounded-lg p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">
            No products yet. Add your first product to get started.
          </p>
          {!showForm && (
            <button
              type="button"
              onClick={openAdd}
              className="bg-black text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-800"
            >
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0 border border-neutral-200">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-black line-clamp-1">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.category}</td>
                  <td className="px-4 py-3 text-black">
                    ₦{p.price?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.stock ?? 0}</td>
                  <td className="px-4 py-3">
                    {p.stock > 0 ? (
                      <span className="text-xs font-medium text-green-700">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-red-600">
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStock(p)}
                        className="text-xs text-neutral-600 underline hover:text-black"
                      >
                        {p.stock > 0 ? "Mark Sold Out" : "Restock"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="text-xs text-neutral-600 underline hover:text-black"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="text-xs text-red-600 underline hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}