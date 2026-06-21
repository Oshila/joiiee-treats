'use client';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { ProductCard } from '../components/ProductCard';

const products = [
  {
    id: 'loaded',
    name: 'Loaded Ice Cream',
    description: 'Cookies & chocolate chunks',
    emoji: '🍪',
    image: '/images/loaded-1.2l.jpg',
    sizes: [
      { id: '330ml', label: '330ml', price: 5000 },
      { id: '550ml', label: '550ml', price: 8000 },
      { id: '1.2L', label: '1.2L', price: 16000 },
    ]
  },
  {
    id: 'oreo',
    name: 'Oreos & Cream',
    description: 'Just Oreos',
    emoji: '🍫',
    image: '/images/oreo-1.2l.jpg',
    sizes: [
      { id: '330ml', label: '330ml', price: 5000 },
      { id: '550ml', label: '550ml', price: 8000 },
      { id: '1.2L', label: '1.2L', price: 16000 },
    ]
  },
  {
    id: 'vanilla',
    name: 'Plain Vanilla',
    description: 'Classic vanilla',
    emoji: '🍦',
    image: '/images/vanilla-1.2l.jpg',
    sizes: [
      { id: '330ml', label: '330ml', price: 5000 },
      { id: '550ml', label: '550ml', price: 8000 },
      { id: '1.2L', label: '1.2L', price: 16000 },
    ]
  },
  {
    id: 'chocolate',
    name: 'Plain Chocolate',
    description: 'Rich chocolate',
    emoji: '🍫',
    image: '/images/chocolate-1.2l.jpg',
    sizes: [
      { id: '330ml', label: '330ml', price: 5000 },
      { id: '550ml', label: '550ml', price: 8000 },
      { id: '1.2L', label: '1.2L', price: 16000 },
    ]
  },
  {
    id: 'loaded-chocolate',
    name: 'Loaded Chocolate',
    description: 'Cookies & chocolate chunks',
    emoji: '🍪',
    image: '/images/chocolate-loaded-1.2l.jpg',
    sizes: [
      { id: '330ml', label: '330ml', price: 5000 },
      { id: '550ml', label: '550ml', price: 8000 },
      { id: '1.2L', label: '1.2L', price: 16000 },
    ]
  }
];

export default function MenuPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20 bg-gradient-to-b from-pink-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">
              Our <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Menu</span>
            </h1>
            <p className="text-gray-500 mt-2">Choose your favorite flavor and size</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} {...product} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}