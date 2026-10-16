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
  inactivos,
  onMarcarPagado,
  onDesactivar,
  onEliminar,
}: {
  pagos: PagoProgramado[];
  /** Pagos desactivados. No se pagan, pero se conservan y se pueden recuperar. */
  inactivos: PagoProgramado[];
  /** Server Action (prev, formData) => Promise<FormState> */
  onMarcarPagado: (
    prev: FormState,
    formData: FormData
  ) => Promise<FormState>;
  onDesactivar: (id: number, activo: boolean) => Promise<void>;
  onEliminar: (id: number) => Promise<void>;
}) {
  const [state, formAction] = useActionState(onMarcarPagado, initialFormState);
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);
  const [verInactivos, setVerInactivos] = useState(false);
  const [porBorrarId, setPorBorrarId] = useState<number | null>(null);
  const [borrando, setBorrando] = useState(false);

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

      {/* Desactivados: visibles, recuperables y eliminables.
          Antes quedaban ocultos para siempre y bloqueaban el borrado de la
          cuenta sin salida. Desactivar es una pausa; borrar es terminar. */}
      {inactivos.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setVerInactivos((v) => !v)}
            aria-expanded={verInactivos}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {verInactivos ? "Ocultar" : "Ver"} {inactivos.length} pago
            {inactivos.length === 1 ? "" : "s"} desactivado
            {inactivos.length === 1 ? "" : "s"}
          </button>

          {verInactivos && (
            <ul className="space-y-2 mt-2">
              {inactivos.map((pago) => {
                const porBorrar = porBorrarId === pago.id;
                return (
                  <li
                    key={pago.id}
                    className="p-3 bg-[var(--muted)] rounded-lg border-l-4 border-[var(--border)] opacity-70"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium">
                          {pago.concepto}
                        </span>
                        <p className="text-sm font-bold">
                          ${pago.valor.toLocaleString("es", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {pago.cuenta_nombre} · {pago.categoria_nombre} · día{" "}
                          {pago.dia_vencimiento}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onDesactivar(pago.id, true)}
                          className="px-3 py-1.5 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-sm font-medium hover:opacity-80"
                        >
                          Reactivar
                        </button>
                        <button
                          type="button"
                          onClick={() => setPorBorrarId(pago.id)}
                          className="px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--destructive)] rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {porBorrar && (
                      <div className="mt-2 p-3 bg-[var(--background)] border border-[var(--destructive)] rounded-lg">
                        <p className="text-sm mb-1 font-medium">
                          ¿Eliminar &quot;{pago.concepto}&quot; definitivamente?
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mb-2">
                          Los gastos e ingresos que ya registraste con este pago
                          se conservan. Solo se borra la plantilla.
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={borrando}
                            onClick={async () => {
                              setBorrando(true);
                              await onEliminar(pago.id);
                              setBorrando(false);
                              setPorBorrarId(null);
                            }}
                            className="px-3 py-1.5 bg-[var(--destructive)] text-white rounded-lg text-sm font-medium disabled:opacity-50"
                          >
                            {borrando ? "Eliminando..." : "Sí, eliminar"}
                          </button>
                          <button
                            type="button"
                            disabled={borrando}
                            onClick={() => setPorBorrarId(null)}
                            className="px-3 py-1.5 bg-[var(--muted)] rounded-lg text-sm disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
