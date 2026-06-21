'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  emoji: string;  // ← Make sure this is here
}

interface CartContextType {
  items: CartItem[];
  addItem: (name: string, size: string, price: number, emoji: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);
  
  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = (name: string, size: string, price: number, emoji: string) => {
    const id = `${name}-${size}-${Date.now()}`;
    setItems(prev => {
      // Check if same item exists (same name and size)
      const existing = prev.find(item => item.name === name && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.name === name && item.size === size 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id, name, size, price, quantity: 1, emoji }];
    });
    // Open cart drawer when adding item
    setIsOpen(true);
  };
  
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
      return;
    }
    setItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };
  
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}