"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Revisa tu correo — te enviamos un enlace de acceso.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center">
            <span className="text-3xl font-bold text-[var(--primary-foreground)]">$</span>
          </div>
          <h1 className="text-2xl font-bold">OpenFinanceKit</h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Ingresa con tu correo para acceder
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                         bg-[var(--background)] focus:outline-none focus:ring-2 
                         focus:ring-[var(--primary)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] 
                       rounded-lg font-medium hover:opacity-90 disabled:opacity-50 
                       transition-opacity"
          >
            {loading ? "Enviando..." : "Enviar enlace de acceso"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
