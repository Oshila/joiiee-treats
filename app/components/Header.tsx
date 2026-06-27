'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/app/providers/CartProvider';

export const Header = () => {
  const { itemCount, setIsOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleCartOpen = () => {
    setIsOpen(true);
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white text-xl">🍦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                joiiee.treats
              </h1>
            </div>
          </Link>
          
          {/* Desktop Navigation - MORE VISIBLE */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300"
            >
              Menu
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              href="/my-orders" 
              className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors duration-300"
            >
              My Orders
            </Link>
          </nav>
          
          {/* Cart Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCartOpen}
              className="relative p-2 rounded-full hover:bg-pink-100 transition-colors"
            >
              <ShoppingBag size={22} className="text-pink-500" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-md">
                  {itemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-pink-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} className="text-gray-700" /> : <Menu size={22} className="text-gray-700" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-lg">
          <div className="p-4 space-y-2">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors text-gray-700 hover:text-pink-500 font-medium"
            >
              <span>Home</span>
            </Link>
            <Link 
              href="/menu" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors text-gray-700 hover:text-pink-500 font-medium"
            >
              <span>Menu</span>
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors text-gray-700 hover:text-pink-500 font-medium"
            >
              <span>About</span>
            </Link>
            <Link 
              href="/my-orders" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors text-gray-700 hover:text-pink-500 font-medium"
            >
              <span>My Orders</span>
            </Link>
            <div className="pt-2 border-t border-pink-100">
              <Link 
                href="/menu" 
                className="block w-full py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};