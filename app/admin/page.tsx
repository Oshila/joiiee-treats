"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    if (password === correct) {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-3 text-center">
          Admin
        </p>
        <h1 className="text-xl font-medium text-center mb-8">OnCart</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-3 py-3 border border-[var(--border)] rounded-md text-sm focus:border-black transition-colors"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 text-sm font-medium rounded-md hover:bg-[var(--hover)]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}