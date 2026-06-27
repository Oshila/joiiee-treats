'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/providers/CartProvider';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  emoji: string;
  image?: string;
  sizes: { id: string; label: string; price: number }[];
  index?: number;
}

export const ProductCard = ({ id, name, description, emoji, image, sizes, index = 0 }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(name, selectedSize.label, selectedSize.price, emoji);
    // You'll see the count update in the cart
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
            <span className="text-white text-sm font-semibold bg-pink-500/80 px-3 py-1 rounded-full">
              {name}
            </span>
          </div>
        </div>
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-pink-500 text-xs font-bold px-3 py-1 rounded-full shadow-md">
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
          <span className="text-2xl font-bold text-pink-500">
            ₦{selectedSize.price.toLocaleString()}
          </span>
          
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};