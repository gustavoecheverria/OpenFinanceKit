"use client";

import { useState } from "react";
import { EditarGastoModal } from "./editar-gasto-modal";
import { deleteGasto } from "@/app/(app)/gastos/actions";

interface Gasto {
  id: number;
  valor: number;
  fecha: string;
  categoria_id: number;
  cuenta_id: number;
  descripcion: string | null;
  categorias: { nombre: string } | null;
  cuentas: { nombre: string } | null;
}

interface GastosListClientProps {
  gastos: Gasto[];
  categorias: Array<{ id: number; nombre: string }>;
  cuentas: Array<{ id: number; nombre: string }>;
}

export function GastosListClient({
  gastos,
  categorias,
  cuentas,
}: GastosListClientProps) {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const gastoEditando = gastos.find((g) => g.id === editandoId);

  return (
    <>
      <ul className="space-y-2">
        {gastos.map((gasto) => (
          <li
            key={gasto.id}
            className="flex items-center justify-between px-3 py-3 bg-[var(--muted)] rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--destructive)]">
                  -${Number(gasto.valor).toLocaleString("es", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] truncate">
                  {gasto.categorias?.nombre}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {gasto.fecha}
                  </span>
                  {gasto.descripcion && (
                    <span className="text-xs text-[var(--muted-foreground)] truncate">
                      · {gasto.descripcion}
                    </span>
                  )}
                </div>
                {gasto.cuentas && (
                  <span className="text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-1.5 py-0.5 rounded truncate ml-2">
                    {gasto.cuentas.nombre}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setEditandoId(gasto.id)}
                className="text-[var(--muted-foreground)] hover:text-[var(--primary)] text-sm"
                aria-label="Editar gasto"
              >
                ✎
              </button>
              <form action={deleteGasto.bind(null, gasto.id)}>
                <button
                  type="submit"
                  className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                  aria-label="Eliminar gasto"
                >
                  ✕
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {gastoEditando && (
        <EditarGastoModal
          gasto={gastoEditando}
          categorias={categorias}
          cuentas={cuentas}
          onClose={() => setEditandoId(null)}
        />
      )}
    </>
  );
}
