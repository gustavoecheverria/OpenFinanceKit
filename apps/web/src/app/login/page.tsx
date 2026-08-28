"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    // Si hay error, signInWithOAuth no redirige — mostramos mensaje
    if (error) {
      setMessage(`Error: ${error.message}`);
      setGoogleLoading(false);
    }
    // Si todo va bien, el navegador se redirige a Google automáticamente
  };

  const handleMagicLink = async (e: React.FormEvent) => {
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
            Ingresa para acceder a tus finanzas
          </p>
        </div>

        {/* Método principal: Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 flex items-center justify-center gap-3
                     border border-[var(--border)] rounded-lg font-medium
                     bg-[var(--background)] hover:bg-[var(--muted)]
                     disabled:opacity-50 transition-colors"
        >
          <GoogleIcon />
          {googleLoading ? "Conectando..." : "Continuar con Google"}
        </button>

        {/* Separador */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--muted-foreground)]">o</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Método secundario: magic link */}
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
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
            className="w-full py-2 px-4 bg-[var(--muted)] text-[var(--foreground)]
                       rounded-lg font-medium hover:opacity-80 disabled:opacity-50 
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

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
