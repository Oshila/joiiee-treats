'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { CheckCircle, Package, Truck, Clock, XCircle, ArrowLeft } from 'lucide-react';

const statusSteps = [
  { id: 'pending', label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
  { id: 'processing', label: 'Processing', icon: Package, color: 'text-blue-500' },
  { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-500' },
  { id: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-500' }
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const q = query(collection(db, 'orders'), where('orderNumber', '==', orderNumber));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setOrder({ id: doc.id, ...doc.data() });
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order');
      }
      setLoading(false);
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-500">Loading order...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
            <p className="text-gray-500 mt-2">Please check your order number</p>
            <Link href="/" className="inline-block mt-4 text-pink-500 hover:text-pink-600 transition-colors">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.id === order.status);

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors mb-6">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-3xl p-8 shadow-md border border-pink-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Order Tracking</h1>
              <p className="text-gray-500">Order #{order.orderNumber}</p>
            </div>
            
            {/* Status Timeline */}
            <div className="relative mb-8">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2" />
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="relative flex items-center mb-8 last:mb-0">
                    <div className="flex-1 text-right pr-8">
                      <p className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-pink-500">Current Status</p>
                      )}
                    </div>
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                        isCompleted
                          ? 'border-pink-500 bg-pink-100'
                          : 'border-gray-200 bg-white'
                      }`}>
                        <Icon size={20} className={isCompleted ? step.color : 'text-gray-400'} />
                      </div>
                    </div>
                    <div className="flex-1 pl-8">
                      <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                        {isCompleted ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Details */}
            <div className="border-t border-pink-100 pt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-800">{order.customer?.name}</p>
                  <p className="text-sm text-gray-600">{order.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-semibold text-gray-800">{order.customer?.address}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Items</p>
                <div className="space-y-1 mt-1">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.emoji} {item.name} ({item.size}) ×{item.quantity}</span>
                      <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-4 pt-4 border-t border-pink-100">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-pink-500">₦{order.total?.toLocaleString()}</span>
              </div>
              
              <div className="mt-6 flex gap-3">
                <a
                  href={`https://wa.me/2348163126734?text=${encodeURIComponent(
                    `Hi, I'm checking on my order #${order.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}