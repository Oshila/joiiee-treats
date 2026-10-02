import { db } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";

export interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  isPreorder: boolean;
  createdAt?: any;
}

export const getProducts = async () => {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const products: Product[] = [];
    snap.forEach((d) => products.push({ id: d.id, ...d.data() } as Product));
    return { success: true, products };
  } catch (e: any) {
    return { success: false, products: [], error: e.message };
  }
};

export const getFeaturedProducts = async () => {
  try {
    const q = query(collection(db, "products"), where("featured", "==", true));
    const snap = await getDocs(q);
    const products: Product[] = [];
    snap.forEach((d) => products.push({ id: d.id, ...d.data() } as Product));
    return { success: true, products };
  } catch (e: any) {
    return { success: false, products: [], error: e.message };
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    const q = query(collection(db, "products"), where("category", "==", category));
    const snap = await getDocs(q);
    const products: Product[] = [];
    snap.forEach((d) => products.push({ id: d.id, ...d.data() } as Product));
    return { success: true, products };
  } catch (e: any) {
    return { success: false, products: [], error: e.message };
  }
};

export const getProduct = async (id: string) => {
  try {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) return { success: false, error: "Not found" };
    return { success: true, product: { id: snap.id, ...snap.data() } as Product };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const addProduct = async (data: Omit<Product, "id" | "createdAt">) => {
  try {
    const ref = await addDoc(collection(db, "products"), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: ref.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    await updateDoc(doc(db, "products", id), data);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, "products", id));
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};