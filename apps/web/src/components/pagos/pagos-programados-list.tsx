"use client";

import { useActionState, useEffect, useState } from "react";
import { PagoProgramadoCard } from "@/components/pagos/pago-programado-card";
// Importa del módulo PURO, no de "@/lib/motor": este es un Client Component y
// "@/lib/motor" arrastra supabase/server (next/headers) al bundle.
import type { PagoProgramado } from "@/lib/motor/programados";
import { initialFormState, type FormState } from "@/lib/form-state";

/**
 * Lista de pagos programados con sus acciones.
 *
 * El estado de cada pago viene calculado desde el Motor. Acá solo se disparan
 * las acciones: marcar pagado o desactivar.
 *
 * IMPORTANTE — por qué las actions se pasan como props y no se importan:
 * importar una server action arrastra al bundle del cliente toda su cadena de
 * dependencias. Se llegó a romper la app entera por eso (supabase/server usa
 * next/headers). La acción llega por prop desde `page.tsx`, que es Server
 * Component, y se invoca con useActionState en vez de con <form action>.
 *
 * Por qué useActionState y no <form action>: con <form action> no hay forma de
 * saber cuándo terminó la action para cerrar la confirmación. Sin ese control,
 * el modal quedaba abierto con el botón "Sí, lo pagué" activo, y el usuario
 * podía disparar el registro varias veces.
 *
 * Verificar antes de marcar pagado: un clic accidental genera un gasto real en
 * la base. Por eso hay un paso de confirmación.
 */
export function PagosProgramadosList({
  pagos,
  onMarcarPagado,
  onDesactivar,
}: {
  pagos: PagoProgramado[];
  /** Server Action (prev, formData) => Promise<FormState> */
  onMarcarPagado: (
    prev: FormState,
    formData: FormData
  ) => Promise<FormState>;
  onDesactivar: (id: number, activo: boolean) => Promise<void>;
}) {
  const [state, formAction] = useActionState(onMarcarPagado, initialFormState);
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);

  // Cuando la action termina bien, se cierra la confirmación. Antes quedaba
  // abierta con el botón activo.
  useEffect(() => {
    if (state.ok) setConfirmandoId(null);
  }, [state.ok]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold">Pagos programados</h2>
        <span className="text-xs text-[var(--muted-foreground)]">
          {pagos.length} activo{pagos.length === 1 ? "" : "s"}
        </span>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-2 px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm"
        >
          {state.error}
        </div>
      )}

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
                    <form action={formAction}>
                      <input type="hidden" name="id" value={pago.id} />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
                      >
                        Sí, lo pagué
                      </button>
                    </form>
                    <button
                      type="button"
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
