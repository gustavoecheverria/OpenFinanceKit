"use client";

import { useState } from "react";
import { PagoProgramadoCard } from "@/components/pagos/pago-programado-card";
// Importa del módulo PURO, no de "@/lib/motor": este es un Client Component y
// "@/lib/motor" arrastra supabase/server (next/headers) al bundle.
import type { PagoProgramado } from "@/lib/motor/programados";

/**
 * Lista de pagos programados con sus acciones.
 *
 * El estado de cada pago viene calculado desde el Motor. Acá solo se disparan
 * las acciones: marcar pagado o desactivar.
 *
 * IMPORTANTE — por qué las actions se pasan como props y no se importan:
 * llamar una server action desde un Client Component la arrastra al bundle del
 * cliente junto con sus dependencias (supabase/server.ts, que usa
 * next/headers) y Next.js tira "You're importing a component that needs
 * next/headers". El patrón correcto es <form action={serverAction}>, y como
 * este archivo es un Client Component, la acción llega por prop desde
 * `page.tsx`, que es un Server Component.
 *
 * Verificar antes de marcar pagado: un clic accidental genera un gasto real en
 * la base. Por eso hay un paso de confirmación.
 */
export function PagosProgramadosList({
  pagos,
  onUsarPago,
  onDesactivar,
}: {
  pagos: PagoProgramado[];
  /** Server Action (id, formData) => Promise<void>, para <form action> */
  onUsarPago: (id: number, formData: FormData) => Promise<void>;
  onDesactivar: (id: number, activo: boolean) => Promise<void>;
}) {
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold">Pagos programados</h2>
        <span className="text-xs text-[var(--muted-foreground)]">
          {pagos.length} activo{pagos.length === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="space-y-2">
        {pagos.map((pago) => {
          const confirmando = confirmandoId === pago.id;

          return (
            <div key={pago.id}>
              <PagoProgramadoCard
                pago={pago}
                onPagar={() => setConfirmandoId(pago.id)}
                onDesactivar={() => onDesactivar(pago.id, false)}
              />

              {/* Confirmación: marcar pagado genera un movimiento real */}
              {confirmando && (
                <div className="mt-2 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm mb-2">
                    ¿Confirmás que pagaste{" "}
                    <span className="font-medium">{pago.concepto}</span> de{" "}
                    <span className="font-medium">
                      ${pago.valor.toLocaleString("es", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    {pago.tipo === "Gasto" ? " como gasto" : " como ingreso"}?
                  </p>
                  <div className="flex gap-2">
                    {/* La Server Action se ejecuta vía <form action>, no
                        importada en el bundle del cliente */}
                    <form action={onUsarPago.bind(null, pago.id)}>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
                      >
                        Sí, lo pagué
                      </button>
                    </form>
                    <button
                      onClick={() => setConfirmandoId(null)}
                      className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
}
