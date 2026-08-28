"use client";

import { useState, useTransition } from "react";
import { DeleteButton } from "./delete-button";

type Categoria = { id: number; nombre: string; tipo: string };
type UpdateAction = (id: number, data: FormData) => Promise<{ error: string | null }>;
type DeleteAction = (id: number) => Promise<{ error: string | null }>;

/**
 * Fila de categoría con modo lectura y modo edición inline.
 */
export function CategoriaRow({
  categoria,
  onUpdate,
  onDelete,
}: {
  categoria: Categoria;
  onUpdate: UpdateAction;
  onDelete: DeleteAction;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await onUpdate(categoria.id, formData);
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
            defaultValue={categoria.nombre}
            required
            className="flex-1 px-2 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-sm"
          />
          <select
            name="tipo"
            defaultValue={categoria.tipo}
            className="px-2 py-1 border border-[var(--border)] rounded bg-[var(--background)] text-sm"
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
          </select>
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
        <span className="text-sm font-medium">{categoria.nombre}</span>
        <span
          className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
            categoria.tipo === "Ingreso"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {categoria.tipo}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-[var(--muted-foreground)] hover:text-[var(--primary)] text-sm"
          aria-label={`Editar ${categoria.nombre}`}
        >
          ✎
        </button>
        <DeleteButton id={categoria.id} action={onDelete} label={`Eliminar ${categoria.nombre}`} />
      </div>
    </li>
  );
}
