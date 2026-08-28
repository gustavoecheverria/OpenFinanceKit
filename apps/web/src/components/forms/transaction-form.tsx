"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { initialFormState, type FormState } from "@/lib/form-state";

type Option = { id: number; nombre: string };

/**
 * Formulario reutilizable para registrar un ingreso o un gasto.
 * Usa useActionState para mostrar errores amigables sin salir de la página.
 * Tras éxito navega a `redirectTo` desde el cliente (ver nota en form-state.ts).
 */
export function TransactionForm({
  action,
  categorias,
  cuentas,
  submitLabel,
  redirectTo,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  categorias: Option[];
  cuentas: Option[];
  submitLabel: string;
  redirectTo: string;
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (state.ok) router.push(redirectTo);
  }, [state.ok, redirectTo, router]);

  const sinDatosMaestros = categorias.length === 0 || cuentas.length === 0;

  return (
    <form action={formAction} className="space-y-4">
      {/* Mensaje de error amigable */}
      {state.error && (
        <div
          role="alert"
          className="px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm"
        >
          {state.error}
        </div>
      )}

      {/* Valor — campo principal */}
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

      {/* Categoría */}
      <div>
        <label htmlFor="categoria_id" className="block text-sm font-medium mb-1">
          Categoría
        </label>
        <select
          id="categoria_id"
          name="categoria_id"
          required
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        >
          <option value="">Seleccionar...</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Cuenta */}
      <div>
        <label htmlFor="cuenta_id" className="block text-sm font-medium mb-1">
          Cuenta
        </label>
        <select
          id="cuenta_id"
          name="cuenta_id"
          required
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        >
          <option value="">Seleccionar...</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div>
        <label htmlFor="fecha" className="block text-sm font-medium mb-1">
          Fecha
        </label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          required
          defaultValue={today}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        />
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium mb-1">
          Descripción{" "}
          <span className="text-[var(--muted-foreground)]">(opcional)</span>
        </label>
        <input
          id="descripcion"
          name="descripcion"
          type="text"
          placeholder="Ej: Sueldo, café, supermercado..."
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        />
      </div>

      {sinDatosMaestros ? (
        <p className="text-sm text-[var(--warning)]">
          Primero crea al menos una categoría y una cuenta en Configuración.
        </p>
      ) : (
        <SubmitButton>{submitLabel}</SubmitButton>
      )}
    </form>
  );
}
