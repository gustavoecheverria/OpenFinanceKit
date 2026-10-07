"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/forms/submit-button";
import { initialFormState, type FormState } from "@/lib/form-state";

interface Cuenta {
  id: number;
  nombre: string;
  saldoActual: number;
}

/**
 * Formulario para transferir saldo entre cuentas.
 *
 * Es la operación que permite que "Efectivo" sea una cuenta con saldo propio:
 * se saca plata de la cuenta del banco y se pasa a Efectivo.
 *
 * El select de destino excluye la cuenta de origen: el CHECK de la base lo
 * impide, pero es mejor no ofrecer una opción que siempre va a fallar.
 */
export function TransferirForm({
  action,
  cuentas,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  cuentas: Cuenta[];
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [origenId, setOrigenId] = useState<string>("");
  const origen = cuentas.find((c) => c.id === Number(origenId));

  useEffect(() => {
    if (state.ok) router.push("/config");
  }, [state.ok, router]);

  const destinos = cuentas.filter((c) => c.id !== Number(origenId));

  if (cuentas.length < 2) {
    return (
      <div className="px-3 py-4 rounded-lg bg-[var(--muted)] text-sm">
        <p className="font-medium">Necesitás al menos dos cuentas</p>
        <p className="text-[var(--muted-foreground)] mt-1">
          Para transferir saldo entre cuentas tenés que tener dos. Creá una
          más en Configuración.
        </p>
      </div>
    );
  }

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

      {/* Origen */}
      <div>
        <label htmlFor="origen_id" className="block text-sm font-medium mb-1">
          Desde
        </label>
        <select
          id="origen_id"
          name="origen_id"
          required
          value={origenId}
          onChange={(e) => setOrigenId(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        >
          <option value="">Selecciona la cuenta de origen...</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.nombre}
              {cuenta.id === Number(origenId) &&
                ` — $${cuenta.saldoActual.toLocaleString("es", { minimumFractionDigits: 2 })}`}
            </option>
          ))}
        </select>
        {origen && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Disponible: ${origen.saldoActual.toLocaleString("es", { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>

      {/* Destino */}
      <div>
        <label htmlFor="destino_id" className="block text-sm font-medium mb-1">
          Hacia
        </label>
        <select
          id="destino_id"
          name="destino_id"
          required
          disabled={!origenId}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] disabled:opacity-50"
        >
          <option value="">
            {origenId ? "Selecciona el destino..." : "Elegí primero el origen"}
          </option>
          {destinos.map((cuenta) => (
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

      {/* Concepto */}
      <div>
        <label htmlFor="concepto" className="block text-sm font-medium mb-1">
          Concepto <span className="text-[var(--muted-foreground)] font-normal">(opcional)</span>
        </label>
        <input
          id="concepto"
          name="concepto"
          type="text"
          maxLength={255}
          placeholder="Ej: retiro a efectivo, traspaso a tarjeta..."
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        />
      </div>

      <div className="px-3 py-2 rounded-lg bg-[var(--muted)] text-xs text-[var(--muted-foreground)]">
        Una transferencia no cambia tu saldo total, solo mueve la plata de una
        cuenta a otra.
      </div>

      <SubmitButton>Transferir</SubmitButton>
    </form>
  );
}
