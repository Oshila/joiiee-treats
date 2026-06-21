'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/providers/CartProvider';

interface ProductCardProps {
  name: string;
  description: string;
  emoji: string;
  image?: string;
  sizes: { id: string; label: string; price: number }[];
  index?: number;
}

export const ProductCard = ({ name, description, emoji, image, sizes, index = 0 }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(0);
  const { addItem } = useCart();
  
  const handleAdd = () => {
    addItem(name, selectedSize.label, selectedSize.price, emoji);
    setQuantity(prev => prev + 1);
  };
  
  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100"
    >
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden">
        {image ? (
          <img 
            src={image}
            alt={name}
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-10 pointer-events-none">
          {emoji}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-semibold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
              {selectedSize.label}
            </span>
            <span className="text-white text-sm font-semibold bg-pink-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
              {name}
            </span>
          </div>
        </div>
        
        <div className="absolute top-3 right-3 bg-[rgba(255,255,255,0.9)] backdrop-blur-sm text-pink-500 text-xs font-bold px-3 py-1 rounded-full shadow-md">
          ⭐ Premium
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>
        
        <div className="flex gap-2 mt-4 flex-wrap">
          {sizes.map(size => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSize.id === size.id
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'bg-pink-50 text-gray-600 hover:bg-pink-100'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-pink-100">
          <div>
            <span className="text-2xl font-bold text-pink-500">
              ₦{selectedSize.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ tub</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRemove}
              className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center disabled:opacity-50 transition-colors"
              disabled={quantity === 0}
            >
              <Minus size={16} className="text-pink-500" />
            </button>
            
            <span className="w-10 text-center text-base font-bold text-gray-700">
              {quantity}
            </span>
            
            <button
              onClick={handleAdd}
              className="w-9 h-9 rounded-full bg-pink-400 hover:bg-pink-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};