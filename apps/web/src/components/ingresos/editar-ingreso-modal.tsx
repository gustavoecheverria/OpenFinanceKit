"use client";

import { useState, useTransition } from "react";
import { updateIngreso } from "@/app/(app)/ingresos/actions";
import type { FormState } from "@/lib/form-state";

interface EditarIngresoModalProps {
  ingreso: {
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

export function EditarIngresoModal({
  ingreso,
  categorias,
  cuentas,
  onClose,
}: EditarIngresoModalProps) {
  const [state, setState] = useState<FormState>({ error: null });
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setState({ error: null });
    startTransition(async () => {
      const result = await updateIngreso(state, formData);
      if (result?.ok) {
        onClose();
      } else {
        setState(result);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[var(--background)] rounded-lg border border-[var(--border)] shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold">Editar Ingreso</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <form action={handleSubmit} className="p-4 space-y-3">
            <input type="hidden" name="id" value={ingreso.id} />

            <div>
              <label className="text-xs text-[var(--muted-foreground)] block mb-1">
                Monto
              </label>
              <input
                type="number"
                name="valor"
                defaultValue={ingreso.valor}
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
                defaultValue={ingreso.descripcion || ""}
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
                defaultValue={ingreso.categoria_id}
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
                defaultValue={ingreso.cuenta_id}
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
                defaultValue={ingreso.fecha}
                required
                className="w-full px-2 py-1.5 text-sm rounded bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
              />
            </div>

            {state?.error && (
              <p className="text-xs text-[var(--destructive)]">{state.error}</p>
            )}

            <div className="flex gap-2 pt-2">
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
      </div>
    </div>
  );
}
