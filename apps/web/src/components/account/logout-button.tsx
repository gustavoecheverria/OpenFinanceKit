"use client";

import { useTransition } from "react";
import { cerrarSesion } from "@/app/(app)/cuenta/actions";

/**
 * Botón para cerrar sesión. Muestra estado de carga mientras procesa.
 */
export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => cerrarSesion())}
      disabled={pending}
      className="w-full py-3 rounded-lg font-medium border border-[var(--destructive)]
                 text-[var(--destructive)] hover:bg-[var(--destructive)]
                 hover:text-white disabled:opacity-50 transition-colors"
    >
      {pending ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  );
}
