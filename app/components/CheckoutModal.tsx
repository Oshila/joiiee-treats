'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, CreditCard, Send, User, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/hooks/useCart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const iconMap: Record<string, string> = {
    'CookieSVG': '🍪',
    'OreoSVG': '🍫',
    'VanillaSVG': '🍦',
    'ChocolateSVG': '🍫'
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleWhatsAppOrder = () => {
    setIsSubmitting(true);
    
    const message = `🍦 *joiiee.treats Order* 🍦\n\n` +
      `👤 *Customer Details*\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}\n\n` +
      `📦 *Order Items*\n` +
      `${items.map(item => 
        `• ${item.name} (${item.size}) ×${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
      ).join('\n')}\n\n` +
      `💰 *Total: ₦${total.toLocaleString()}*\n\n` +
      `💳 *Payment Details*\n` +
      `Account: Opay 8163126734\n` +
      `Name: Joy Chidinma\n\n` +
      `📸 Please send payment receipt after transfer.`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/2348163126734?text=${encoded}`, '_blank');
    
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      onClose();
      setFormData({ name: '', phone: '', address: '' });
    }, 1000);
  };
  
  const copyPayment = () => {
    navigator.clipboard.writeText('8163126734');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const isFormValid = formData.name && formData.phone && formData.address;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white p-4 border-b border-pink-100 rounded-t-3xl flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CreditCard size={20} className="text-pink-500" />
                Checkout
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-pink-50/50 rounded-2xl p-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Order Summary</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-pink-100/50">
                      <span className="text-gray-600">
                        {iconMap[item.icon] || '🍦'} {item.name} 
                        <span className="text-gray-400"> ×{item.quantity}</span>
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
                  Payment Information
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
                disabled={!isFormValid || isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Order via WhatsApp
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};