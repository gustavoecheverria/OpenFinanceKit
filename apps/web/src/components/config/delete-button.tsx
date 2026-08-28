"use client";

import { useState, useTransition } from "react";

type DeleteAction = (id: number) => Promise<{ error: string | null }>;

/**
 * Botón de eliminar para items de Configuración (categorías, cuentas).
 * Llama a la Server Action, y si devuelve un error (ej: la cuenta tiene
 * movimientos asociados), lo muestra de forma amigable en lugar de romper.
 */
export function DeleteButton({
  id,
  action,
  label,
}: {
  id: number;
  action: DeleteAction;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await action(id);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm disabled:opacity-50"
        aria-label={label}
      >
        {pending ? "…" : "✕"}
      </button>
      {error && (
        <span
          role="alert"
          className="mt-1 text-[10px] text-[var(--destructive)] max-w-[180px] text-right leading-tight"
        >
          {error}
        </span>
      )}
    </div>
  );
}
