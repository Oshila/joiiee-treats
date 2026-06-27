'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { products } from '@/app/data/products';

export const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-500 text-sm font-semibold rounded-full mb-4">
            Our Collection
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Premium <span className="text-gradient">Flavors</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Discover our most loved ice cream flavors, crafted with premium ingredients
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} {...product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};