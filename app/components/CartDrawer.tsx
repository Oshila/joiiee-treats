'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, User, Phone, MapPin, CreditCard, Copy, Check } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const CartDrawer = () => {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart, isOpen, setIsOpen } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

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
              <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-pink-50/30">
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
                          {item.emoji || '🍦'}
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
                      onClick={handleCheckout}
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