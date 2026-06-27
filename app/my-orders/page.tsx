'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const searchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const q = query(collection(db, 'orders'), where('customer.email', '==', email));
      const querySnapshot = await getDocs(q);
      const ordersList: any[] = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
          
          {/* Search by Email */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100 mb-6">
            <p className="text-gray-600 mb-4">Enter your email to see your orders:</p>
            <form onSubmit={searchOrders} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
              >
                Find Orders
              </button>
            </form>
          </div>

          {/* Orders List */}
          {searched && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100">
              <h2 className="font-semibold text-gray-700 mb-4">
                {loading ? 'Searching...' : `${orders.length} order(s) found`}
              </h2>
              
              {loading ? (
                <p className="text-gray-500">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found for this email</p>
                  <p className="text-sm text-gray-400 mt-1">Make sure you used the same email when ordering</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <Link href={`/order/${order.orderNumber}`} className="font-bold text-pink-500 hover:underline">
                            {order.orderNumber}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {order.createdAt?.toDate?.() ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">₦{(order.total || 0).toLocaleString()}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status || 'pending'}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/order/${order.orderNumber}`}
                        className="inline-block mt-3 text-sm text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        🔍 View Order →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}