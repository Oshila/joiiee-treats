import { db } from '@/app/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface Order {
  id?: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: {
    name: string;
    size: string;
    quantity: number;
    price: number;
    emoji: string;
  }[];
  total: number;
  paymentReference: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: any; // ← Made optional
}

// Save order to Firestore
export const saveOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving order:', error);
    return { success: false, error };
  }
};

// Get all orders from Firestore
export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, orders: [], error };
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error };
  }
};