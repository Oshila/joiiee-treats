import { db } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentReference: string;
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt?: any;
}

export const generateOrderNumber = () => {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `SWM-${ts}${rand}`;
};

export const saveOrder = async (data: Omit<Order, "id" | "createdAt">) => {
  try {
    const ref = await addDoc(collection(db, "orders"), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: ref.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const getOrders = async () => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => orders.push({ id: d.id, ...d.data() } as Order));
    return { success: true, orders };
  } catch (e: any) {
    return { success: false, orders: [], error: e.message };
  }
};

export const updateOrder = async (id: string, data: Partial<Order>) => {
  try {
    await updateDoc(doc(db, "orders", id), data);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const findOrder = async (orderNumber: string, phone: string) => {
  try {
    const snap = await getDocs(collection(db, "orders"));
    let found: any = null;
    const num = orderNumber.trim().toLowerCase();
    const ph = phone.trim();
    snap.forEach((d) => {
      const data = d.data();
      if (
        data.orderNumber?.toLowerCase() === num &&
        data.customer?.phone === ph
      ) {
        found = { id: d.id, ...data };
      }
    });
    if (found) return { success: true, order: found };
    return { success: false, error: "No order found" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};