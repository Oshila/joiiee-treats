'use client';

import { AuthProvider } from '@/app/providers/AuthProvider';
import { CartProvider } from '@/app/providers/CartProvider';
import AdminLoginPage from './page';

export default function AdminWrapper() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminLoginPage />
      </CartProvider>
    </AuthProvider>
  );
}