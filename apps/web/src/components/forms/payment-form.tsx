"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { initialFormState, type FormState } from "@/lib/form-state";

/**
 * Formulario para registrar un pago programado.
 * Usa useActionState para mostrar errores amigables sin salir de la página.
 * Tras éxito navega a /pagos desde el cliente.
 */
export function PaymentForm({
  action,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (state.ok) router.push("/pagos");
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          role="alert"
          className="px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm"
        >
          {state.error}
        </div>
      )}

      {/* Valor */}
      <div>
        <label htmlFor="valor" className="block text-sm font-medium mb-1">
          Valor
        </label>
        <input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          min="0.01"
          required
          inputMode="decimal"
          placeholder="0.00"
          className="w-full px-3 py-3 text-2xl border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Concepto */}
      <div>
        <label htmlFor="concepto" className="block text-sm font-medium mb-1">
          Concepto
        </label>
        <input
          id="concepto"
          name="concepto"
          type="text"
          required
          maxLength={255}
          placeholder="Ej: Internet, seguro, gimnasio..."
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        />
      </div>

      {/* Fecha de vencimiento */}
      <div>
        <label htmlFor="fecha_vencimiento" className="block text-sm font-medium mb-1">
          Fecha de vencimiento
        </label>
        <input
          id="fecha_vencimiento"
          name="fecha_vencimiento"
          type="date"
          required
          defaultValue={today}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        />
      </div>

      {/* Estado */}
      <div>
        <label htmlFor="estado" className="block text-sm font-medium mb-1">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          required
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
          <option value="Vencido">Vencido</option>
        </select>
      </div>

      <SubmitButton>Guardar pago</SubmitButton>
    </form>
  );
}
