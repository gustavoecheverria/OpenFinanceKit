"use client";

import { useActionState } from "react";
import { initialFormState, type FormState } from "@/lib/form-state";

/**
 * Formulario para agregar una cuenta nueva.
 * Usa useActionState para mostrar errores inline sin recargar la página.
 */
export function AddCuentaForm({
  action,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="space-y-2 mb-4">
      <div className="flex gap-2">
        <input
          name="nombre"
          type="text"
          placeholder="Nombre"
          required
          maxLength={100}
          className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm"
        />
        <input
          name="saldo_inicial"
          type="number"
          step="0.01"
          min="0"
          placeholder="Saldo"
          required
          className="w-24 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium"
        >
          +
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
