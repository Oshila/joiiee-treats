'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, User, Phone, MapPin, CreditCard, Copy, Check } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';
import { useState } from 'react';

export const CartDrawer = () => {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart, isOpen, setIsOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [copied, setCopied] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const copyPayment = () => {
    navigator.clipboard.writeText('8163126734');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleWhatsAppOrder = () => {
    const message = `🍦 *joiiee.treats Order* 🍦\n\n` +
      `👤 *Customer Details*\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}\n\n` +
      `📦 *Order Items*\n` +
      `${items.map(item => 
        `• ${item.emoji} ${item.name} (${item.size}) ×${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
      ).join('\n')}\n\n` +
      `💰 *Total: ₦${total.toLocaleString()}*\n\n` +
      `💳 *Payment Details*\n` +
      `Account: Opay 8163126734\n` +
      `Name: Joy Chidinma\n\n` +
      `📸 Please send payment receipt after transfer.`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/2348163126734?text=${encoded}`, '_blank');
    clearCart();
    setIsOpen(false);
    setShowCheckout(false);
    setFormData({ name: '', phone: '', address: '' });
  };
  
  // If checkout is open, show checkout form
  if (showCheckout) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {
                setShowCheckout(false);
                setIsOpen(false);
              }}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-pink-500" />
                    <h2 className="text-lg font-bold text-gray-800">Checkout</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setIsOpen(false);
                    }}
                    className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                
                {/* Order Summary */}
                <div className="bg-pink-50/50 rounded-2xl p-4">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Order Summary</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm py-1 border-b border-pink-100/50">
                        <span className="text-gray-600">
                          {item.emoji} {item.name} ×{item.quantity}
                        </span>
                        <span className="font-medium text-pink-500">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-pink-200">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-pink-500">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Customer Form */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700">Delivery Details</h3>
                  
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      placeholder="Delivery address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-100 focus:border-pink-400 focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>
                
                {/* Payment Info */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CreditCard size={16} className="text-pink-400" />
                    Payment Details
                  </p>
                  
                  <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Opay Account</p>
                      <p className="font-mono font-bold text-gray-800 text-lg">8163126734</p>
                      <p className="text-xs text-gray-500">Joy Chidinma</p>
                    </div>
                    <button
                      onClick={copyPayment}
                      className="flex items-center gap-2 px-4 py-2 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} className="text-pink-500" />
                      )}
                      <span className="text-xs font-medium text-gray-700">
                        {copied ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span>📸</span>
                    Send payment receipt after transfer
                  </p>
                </div>
                
                {/* Submit Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!formData.name || !formData.phone || !formData.address}
                  className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>📱</span>
                  Send Order via WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
  
  // Regular cart view
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-[rgba(252,228,232,0.3)]">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-pink-500" />
                  <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
                  <span className="text-xs bg-pink-400 text-white px-2 py-0.5 rounded-full">
                    {itemCount} items
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                      🍦
                    </div>
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-sm text-gray-400">Add some delicious ice cream!</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="bg-pink-50/50 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {item.emoji}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.size}</p>
                          <p className="text-sm font-bold text-pink-500">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                           className="w-7 h-7 rounded-full bg-white shadow-sm hover:bg-pink-50 flex items-center justify-center text-pink-500 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-pink-400 hover:bg-pink-500 flex items-center justify-center text-white shadow-sm transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-pink-100 p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-pink-500">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};