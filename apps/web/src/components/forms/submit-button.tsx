"use client";

import { useFormStatus } from "react-dom";

/**
 * Botón de envío que se deshabilita y muestra estado de carga mientras
 * la Server Action está en curso. Previene el doble submit (doble registro).
 * Debe usarse dentro de un <form> con Server Action.
 */
export function SubmitButton({
  children,
  pendingText = "Guardando...",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={
        className ??
        "w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      }
    >
      {pending ? pendingText : children}
    </button>
  );
}
