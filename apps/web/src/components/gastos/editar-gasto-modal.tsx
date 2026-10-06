"use client";

import { useState, useTransition } from "react";
import { updateGasto } from "@/app/(app)/gastos/actions";
import type { FormState } from "@/lib/form-state";

interface EditarGastoModalProps {
  gasto: {
    id: number;
    valor: number;
    fecha: string;
    categoria_id: number;
    cuenta_id: number;
    descripcion: string | null;
  };
  categorias: Array<{ id: number; nombre: string }>;
  cuentas: Array<{ id: number; nombre: string }>;
  onClose: () => void;
}

export function EditarGastoModal({
  gasto,
  categorias,
  cuentas,
  onClose,
}: EditarGastoModalProps) {
  const [state, setState] = useState<FormState>({ error: null });
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setState({ error: null });
    startTransition(async () => {
      const result = await updateGasto(state, formData);
      if (result?.ok) {
        onClose();
      } else {
        setState(result);
      }
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto p-4 bg-[var(--background)] rounded-t-lg border-t border-[var(--border)] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Editar Gasto</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="space-y-3">
          <input type="hidden" name="id" value={gasto.id} />

          <div>
            <label className="text-xs text-[var(--muted-foreground)] block mb-1">
              Monto
            </label>
            <input
              type="number"
              name="valor"
              defaultValue={gasto.valor}
              step="0.01"
              min="0"
              required
              className="w-full px-2 py-1.5 text-sm rounded bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--muted-foreground)] block mb-1">
              Descripción
            </label>
            <input
              type="text"
              name="descripcion"
              defaultValue={gasto.descripcion || ""}
              maxLength={255}
              className="w-full px-2 py-1.5 text-sm rounded bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--muted-foreground)] block mb-1">
              Categoría
            </label>
            <select
              name="categoria_id"
              defaultValue={gasto.categoria_id}
              required
              className="w-full px-2 py-1.5 text-sm rounded bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--muted-foreground)] block mb-1">
              Cuenta
            </label>
            <select
              name="cuenta_id"
              defaultValue={gasto.cuenta_id}
              required
              className="w-full px-2 py-1.5 text-sm rounded bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            >
              {cuentas.map((cuenta) => (
                <option key={cuenta.id} value={cuenta.id}>
                  {cuenta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--muted-foreground)] block mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              defaultValue={gasto.fecha}
              required
              className="w-full px-2 py-1.5 text-sm rounded bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            />
          </div>

          {state?.error && (
            <p className="text-xs text-[var(--destructive)]">{state.error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-1.5 text-sm rounded bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 px-3 py-1.5 text-sm rounded bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
