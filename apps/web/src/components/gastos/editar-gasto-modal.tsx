"use client";

import { useState, useTransition } from "react";
import { Portal } from "@/lib/portal";
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
    <Portal>
      <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[var(--background)] rounded-lg border border-[var(--border)] shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-base font-semibold">Editar Gasto</h2>
            <button
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto flex-1 max-h-[calc(100vh-200px)]">
            <form action={handleSubmit} className="p-6 space-y-4">
            <input type="hidden" name="id" value={gasto.id} />

            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">
                Monto
              </label>
              <input
                type="number"
                name="valor"
                defaultValue={gasto.valor}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 text-sm rounded-md bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">
                Descripción
              </label>
              <input
                type="text"
                name="descripcion"
                defaultValue={gasto.descripcion || ""}
                maxLength={255}
                placeholder="Opcional"
                className="w-full px-3 py-2 text-sm rounded-md bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">
                Categoría
              </label>
              <select
                name="categoria_id"
                defaultValue={gasto.categoria_id}
                required
                className="w-full px-3 py-2 text-sm rounded-md bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">
                Cuenta
              </label>
              <select
                name="cuenta_id"
                defaultValue={gasto.cuenta_id}
                required
                className="w-full px-3 py-2 text-sm rounded-md bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
              >
                {cuentas.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-2">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                defaultValue={gasto.fecha}
                required
                className="w-full px-3 py-2 text-sm rounded-md bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
              />
            </div>

            {state?.error && (
              <div className="px-3 py-2 rounded-md bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 text-xs text-[var(--destructive)]">
                {state.error}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pending ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Portal>
  );
}
