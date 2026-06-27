'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/providers/CartProvider';
import { saveOrder } from '@/app/services/orderservice';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { User, Phone, MapPin, Mail, ArrowLeft, CheckCircle, Package, Truck, Clock } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  useEffect(() => {
    if (items.length === 0 && !paymentSuccess) {
      router.push('/');
    }
  }, [items, router, paymentSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful:', response);
    
    const orderNum = `JOI-${Date.now().toString().slice(-4)}`;
    setOrderNumber(orderNum);
    setPaymentReference(response.reference || 'N/A');
    
    const orderData = {
      orderNumber: orderNum,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      },
      items: items.map(item => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        emoji: item.emoji
      })),
      total: total,
      paymentReference: response.reference || 'N/A',
      status: 'pending' as const,
      notes: notes || ''
    };

    try {
      console.log('Saving order to Firestore...');
      const result = await saveOrder(orderData);
      console.log('Save result:', result);
      
      if (result.success) {
        localStorage.setItem('lastOrder', JSON.stringify({
          orderNumber: orderNum,
          orderId: result.id,
          customerName: formData.name,
          total: total,
          timestamp: new Date().toISOString()
        }));
        
        setOrderId(result.id || '');
        setPaymentSuccess(true);
        clearCart();
        setLoading(false);
      } else {
        console.error('Failed to save order:', result.error);
        setError(`Payment successful but order could not be saved: ${result.error || 'Unknown error'}`);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Error saving order:', err);
      setError(`Error saving order: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const handlePaystackPayment = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);

    if (typeof window !== 'undefined' && window.PaystackPop) {
      openPaystack();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Paystack script loaded');
      openPaystack();
    };
    
    script.onerror = () => {
      setError('Failed to load payment gateway. Please try again.');
      setLoading(false);
    };
    
    document.body.appendChild(script);
  };

  const openPaystack = () => {
    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      
      if (!publicKey || publicKey === '') {
        setError('Payment configuration error. Please contact support.');
        setLoading(false);
        return;
      }

      console.log('Opening Paystack');

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: formData.email,
        amount: total * 100,
        currency: 'NGN',
        ref: `JOI-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: formData.name
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: formData.phone
            },
            {
              display_name: "Address",
              variable_name: "address",
              value: formData.address
            }
          ]
        },
        callback: function(response: any) {
          console.log('Paystack callback received:', response);
          setLoading(false);
          handlePaymentSuccess(response);
        },
        onClose: function() {
          console.log('Paystack modal closed');
          setLoading(false);
        }
      });

      handler.openIframe();
    } catch (err) {
      console.error('Paystack error:', err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  // Success page
  if (paymentSuccess) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-pink-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-pink-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Payment Successful! 🎉</h1>
                <p className="text-gray-500 mt-2">Thank you for your order</p>
              </div>

              <div className="bg-pink-50 rounded-2xl p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-2xl font-bold text-pink-500">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Reference</p>
                    <p className="text-sm font-mono text-gray-700">{paymentReference}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
                <p className="text-sm text-gray-700 mb-2 font-medium">📌 Save this link to track your order:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/order/${orderNumber}`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-300 text-gray-700 text-sm min-w-[200px]"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/order/${orderNumber}`);
                      alert('✅ Link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm font-medium"
                  >
                    Copy Link
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">💡 Bookmark this link to check your order status anytime</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">Order Status</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Order Placed</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300 flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Package size={16} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-400">Processing</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300 flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Truck size={16} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-400">Delivery</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300 flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-pink-100 pt-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-pink-50">
                      <span className="text-gray-700">{item.emoji} {item.name} ({item.size}) ×{item.quantity}</span>
                      <span className="font-medium text-gray-700">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-pink-100 mt-3">
                  <span className="text-gray-800">Total</span>
                  <span className="text-pink-500">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Delivery Details</h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-700"><span className="text-gray-500">Name:</span> {formData.name}</p>
                  <p className="text-gray-700"><span className="text-gray-500">Phone:</span> {formData.phone}</p>
                  <p className="md:col-span-2 text-gray-700"><span className="text-gray-500">Address:</span> {formData.address}</p>
                  {notes && (
                    <p className="md:col-span-2 text-gray-700"><span className="text-gray-500">Notes:</span> {notes}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/order/${orderNumber}`}
                  className="flex-1 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors text-center"
                >
                  🔍 Track Order
                </Link>
                <a
                  href={`https://wa.me/2348163126734?text=${encodeURIComponent(
                    `Hi, I just placed order #${orderNumber}. My name is ${formData.name}. Please confirm my order.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors text-center"
                >
                  💬 Contact Us
                </a>
                <Link
                  href="/"
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center"
                >
                  🏠 Home
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Checkout Form
  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors mb-6">
            <ArrowLeft size={20} />
            Back to Menu
          </Link>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-pink-50">
                      <span className="text-gray-700">{item.emoji} {item.name} ×{item.quantity}</span>
                      <span className="font-medium text-gray-700">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-pink-100 mt-3 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">Total</span>
                    <span className="text-pink-500">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>
                
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                      ❌ {error}
                    </div>
                  )}

                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      placeholder="Delivery address *"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-gray-600"
                      required
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      name="notes"
                      placeholder="📝 Special instructions or delivery notes (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-gray-600 resize-none"
                    />
                  </div>

                  <button
                    onClick={handlePaystackPayment}
                    disabled={!formData.name || !formData.phone || !formData.email || !formData.address || loading}
                    className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </span>
                    ) : (
                      `Pay ₦${total.toLocaleString()} with Paystack`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}