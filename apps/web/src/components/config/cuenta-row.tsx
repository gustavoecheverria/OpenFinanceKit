"use client";

import { useState, useTransition } from "react";
import { DeleteButton } from "./delete-button";

type Cuenta = { id: number; nombre: string; saldo_inicial: number | string };
type UpdateAction = (id: number, data: FormData) => Promise<{ error: string | null }>;
type DeleteAction = (id: number) => Promise<{ error: string | null }>;

/**
 * Fila de cuenta con modo lectura y modo edición inline.
 */
export function CuentaRow({
  cuenta,
  onUpdate,
  onDelete,
}: {
  cuenta: Cuenta;
  onUpdate: UpdateAction;
  onDelete: DeleteAction;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await onUpdate(cuenta.id, formData);
      if (result?.error) setError(result.error);
      else setEditing(false);
    });
  };

  if (editing) {
    return (
      <li className="px-3 py-2 bg-[var(--muted)] rounded-lg">
        <form action={handleSubmit} className="flex gap-2 items-center">
          <input
            name="nombre"
            defaultValue={cuenta.nombre}
            required
            className="flex-1 px-2 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-sm"
          />
          <input
            name="saldo_inicial"
            type="number"
            step="0.01"
            min="0"
            defaultValue={Number(cuenta.saldo_inicial)}
            required
            className="w-24 px-2 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className="text-xs px-2 py-1 bg-[var(--primary)] text-[var(--primary-foreground)] rounded disabled:opacity-50"
          >
            {pending ? "…" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => { setEditing(false); setError(null); }}
            className="text-xs px-2 py-1 text-[var(--muted-foreground)]"
          >
            Cancelar
          </button>
        </form>
        {error && (
          <span role="alert" className="mt-1 block text-[10px] text-[var(--destructive)]">
            {error}
          </span>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between px-3 py-2 bg-[var(--muted)] rounded-lg">
      <div>
        <span className="text-sm font-medium">{cuenta.nombre}</span>
        <span className="ml-2 text-xs text-[var(--muted-foreground)]">
          ${Number(cuenta.saldo_inicial).toLocaleString("es", { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-[var(--muted-foreground)] hover:text-[var(--primary)] text-sm"
          aria-label={`Editar ${cuenta.nombre}`}
        >
          ✎
        </button>
        <DeleteButton id={cuenta.id} action={onDelete} label={`Eliminar ${cuenta.nombre}`} />
      </div>
    </li>
  );
}
