"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/forms/submit-button";
import { initialFormState, type FormState } from "@/lib/form-state";
// Importa del módulo PURO, no de "@/lib/motor": este es un Client Component y
// "@/lib/motor" arrastra supabase/server (next/headers) al bundle.
import { DIAS_AL_DIA } from "@/lib/motor/fechas";
import type { Recurrencia } from "@/lib/motor/fechas";

interface Cuenta {
  id: number;
  nombre: string;
}

const RECURRENCIAS: Recurrencia[] = ["Mensual", "Quincenal", "Semanal"];

/** Texto explicativo de cada recurrencia, con su período de gracia. */
const DESCRIPCION_RECURRENCIA: Record<Recurrencia, string> = {
  Mensual: "Vence el mismo día cada mes",
  Quincenal: "Vence dos veces al mes: ese día y 15 días después",
  Semanal: "Vence cada 7 días",
};

/**
 * Formulario para registrar un pago programado (plantilla recurrente).
 *
 * La cuenta es obligatoria: "Efectivo" es una cuenta más de la lista, no una
 * opción aparte. Para pasar plata del banco a Efectivo se usa /cuentas/transferir.
 *
 * El día de vencimiento se separa de la fecha de inicio para que el cálculo
 * mensual no dependa de parsear la última fecha pagada.
 */
export function PagoProgramadoForm({
  action,
  cuentas,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  cuentas: Cuenta[];
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [tipo, setTipo] = useState<"Gasto" | "Ingreso">("Gasto");
  const [recurrencia, setRecurrencia] = useState<Recurrencia>("Mensual");
  const [fechaInicio, setFechaInicio] = useState(today);

  useEffect(() => {
    if (state.ok) router.push("/pagos");
  }, [state.ok, router]);

  // Si el usuario no cambió la fecha de inicio, el día de vencimiento se
  // sugiere como el mismo día del mes. Si la cambió, se recalcula.
  const diaSugerido = useMemo(
    () => Number(fechaInicio.slice(-2)) || 1,
    [fechaInicio]
  );
  const [diaVencimiento, setDiaVencimiento] = useState<string>(String(diaSugerido));

  function alCambiarFechaInicio(e: React.ChangeEvent<HTMLInputElement>) {
    setFechaInicio(e.target.value);
    setDiaVencimiento(String(Number(e.target.value.slice(-2)) || 1));
  }

  if (cuentas.length === 0) {
    return (
      <div className="px-3 py-4 rounded-lg bg-[var(--muted)] text-sm">
        <p className="font-medium">Necesitás al menos una cuenta</p>
        <p className="text-[var(--muted-foreground)] mt-1">
          Los pagos programados siempre se asignan a una cuenta. Creá una en
          Configuración para poder empezar.
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
          placeholder="Ej: arriendo, salary, cuota del auto..."
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        />
      </div>

      {/* Tipo: Gasto o Ingreso */}
      <fieldset>
        <legend className="block text-sm font-medium mb-2">
          Este pago va a
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(["Gasto", "Ingreso"] as const).map((t) => (
            <label
              key={t}
              className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer transition-colors ${
                tipo === t
                  ? "border-[var(--primary)] bg-[var(--muted)]"
                  : "border-[var(--border)]"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={tipo === t}
                onChange={() => setTipo(t)}
                className="accent-[var(--primary)]"
              />
              <span className="text-sm">
                {t === "Gasto" ? "Gastos" : "Ingresos"}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
          {tipo === "Gasto"
            ? "Cuando lo marques como pagado, se sumará a tu historial de gastos."
            : "Cuando lo marques como pagado, se sumará a tu historial de ingresos."}
        </p>
      </fieldset>

      {/* Recurrencia */}
      <div>
        <label htmlFor="recurrencia" className="block text-sm font-medium mb-1">
          Cada cuánto se repite
        </label>
        <select
          id="recurrencia"
          name="recurrencia"
          required
          value={recurrencia}
          onChange={(e) => setRecurrencia(e.target.value as Recurrencia)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        >
          {RECURRENCIAS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          {DESCRIPCION_RECURRENCIA[recurrencia]}
        </p>
      </div>

      {/* Fecha de inicio y día de vencimiento */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="fecha_inicio" className="block text-sm font-medium mb-1">
            Primer vencimiento
          </label>
          <input
            id="fecha_inicio"
            name="fecha_inicio"
            type="date"
            required
            value={fechaInicio}
            onChange={alCambiarFechaInicio}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          />
        </div>

        <div>
          <label htmlFor="dia_vencimiento" className="block text-sm font-medium mb-1">
            Día del mes
          </label>
          <input
            id="dia_vencimiento"
            name="dia_vencimiento"
            type="number"
            min="1"
            max="31"
            required
            value={diaVencimiento}
            onChange={(e) => setDiaVencimiento(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          />
        </div>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] -mt-2">
        El día del mes se usa para todas las repeticiones. Si elegís 31 y un
        mes tiene menos días, vence el último día de ese mes.
      </p>

      {/* Cuenta: obligatoria */}
      <div>
        <label htmlFor="cuenta_id" className="block text-sm font-medium mb-1">
          Desde qué cuenta
        </label>
        <select
          id="cuenta_id"
          name="cuenta_id"
          required
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
        >
          <option value="">Selecciona una cuenta...</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.nombre}
            </option>
          ))}
        </select>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          &quot;Efectivo&quot; es una cuenta más. Si retirás plata del banco para
          tener efectivo, transferila primero desde Configuración.
        </p>
      </div>

      {/* Preview del comportamiento */}
      <div className="px-3 py-2.5 rounded-lg bg-[var(--muted)] text-xs space-y-1">
        <p className="font-medium text-[var(--foreground)]">
          Cómo va a funcionar
        </p>
        <p>
          Queda como plantilla permanente. Cada vez que lo marques como pagado
          se{" "}
          {tipo === "Gasto" ? "suma a tus gastos" : "suma a tus ingresos"} y el
          vencimiento se renueva solo para el período siguiente.
        </p>
        <p>
          Durante {DIAS_AL_DIA[recurrencia]}{" "}
          {DIAS_AL_DIA[recurrencia] === 1 ? "día" : "días"} después de
          pagarlo queda en estado &quot;Al día&quot;, sin avisos.
        </p>
      </div>

      <SubmitButton>Crear pago programado</SubmitButton>
    </form>
  );
}
