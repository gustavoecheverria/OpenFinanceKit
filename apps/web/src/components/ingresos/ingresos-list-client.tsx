"use client";

import { useState } from "react";
import { EditarIngresoModal } from "./editar-ingreso-modal";
import { deleteIngreso } from "@/app/(app)/ingresos/actions";

interface Ingreso {
  id: number;
  valor: number;
  fecha: string;
  categoria_id: number;
  cuenta_id: number;
  descripcion: string | null;
  categorias: { nombre: string } | null;
  cuentas: { nombre: string } | null;
}

interface IngresosListClientProps {
  ingresos: Ingreso[];
  categorias: Array<{ id: number; nombre: string }>;
  cuentas: Array<{ id: number; nombre: string }>;
}

export function IngresosListClient({
  ingresos,
  categorias,
  cuentas,
}: IngresosListClientProps) {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const ingresoEditando = ingresos.find((i) => i.id === editandoId);

  return (
    <>
      <ul className="space-y-2">
        {ingresos.map((ingreso) => (
          <li
            key={ingreso.id}
            className="flex items-center justify-between px-3 py-3 bg-[var(--muted)] rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--success)]">
                  +${Number(ingreso.valor).toLocaleString("es", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] truncate">
                  {ingreso.categorias?.nombre}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[var(--muted-foreground)]">
                  {ingreso.fecha}
                </span>
                {ingreso.descripcion && (
                  <span className="text-xs text-[var(--muted-foreground)] truncate">
                    · {ingreso.descripcion}
                  </span>
                )}
                {ingreso.cuentas && (
                  <span className="text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-1.5 py-0.5 rounded truncate ml-2">
                    {ingreso.cuentas.nombre}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setEditandoId(ingreso.id)}
                className="text-[var(--muted-foreground)] hover:text-[var(--primary)] text-sm"
                aria-label="Editar ingreso"
              >
                ✎
              </button>
              <form action={deleteIngreso.bind(null, ingreso.id)}>
                <button
                  type="submit"
                  className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                  aria-label="Eliminar ingreso"
                >
                  ✕
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {ingresoEditando && (
        <EditarIngresoModal
          ingreso={ingresoEditando}
          categorias={categorias}
          cuentas={cuentas}
          onClose={() => setEditandoId(null)}
        />
      )}
    </>
  );
}
