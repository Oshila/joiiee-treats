'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Truck, Award } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
             className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.8)] backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md"
            >
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-gray-700">4.9/5 Rating</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-medium text-pink-500">1,200+ Orders</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-gray-800">Crafted with </span>
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Love</span>
              <br />
              <span className="text-gray-800">Delivered with </span>
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Joy</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-md leading-relaxed"
            >
              Premium artisanal ice cream made with the finest ingredients. 
              Choose your size and customize with your favorite toppings.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Explore Menu
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-105"
              >
                Our Story
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 pt-4 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-pink-400" />
                <span className="text-sm text-gray-600">Fast&Cheap delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-pink-400" />
                <span className="text-sm text-gray-600">Premium quality</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-400 text-lg">🍦</span>
                <span className="text-sm text-gray-600">3 sizes available</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-100 rounded-full opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[200px]">🍦</span>
              </div>
              
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 left-0 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">4.9/5</p>
                    <p className="text-xs text-gray-500">1,200 reviews</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 right-0 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Premium</p>
                    <p className="text-xs text-gray-500">Quality ingredients</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};