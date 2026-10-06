"use client";

import { useState } from "react";
import { reasignarPago } from "@/app/(app)/pagos/sin-asignar/actions";

interface Pago {
  id: number;
  concepto: string;
  fecha_vencimiento: string | null;
  valor: number;
  estado: string;
}

interface Cuenta {
  id: number;
  nombre: string;
}

interface UnassignedPaymentCardProps {
  pago: Pago;
  cuentas: Cuenta[];
}

export function UnassignedPaymentCard({ pago, cuentas }: UnassignedPaymentCardProps) {
  const [selectedCuentaId, setSelectedCuentaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReasignar = async () => {
    if (!selectedCuentaId) {
      setError("Debes seleccionar una cuenta");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await reasignarPago(pago.id, selectedCuentaId);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        // Recargar la página para ver los cambios
        window.location.reload();
      }, 1000);
    } else {
      setError(result.error || "Error al reasignar");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-3 bg-[var(--muted)] rounded-lg border-l-2 border-[var(--success)]">
        <p className="text-sm text-[var(--success)] font-semibold">
          ✅ Pago reasignado correctamente
        </p>
      </div>
    );
  }

  const fechaFormato = pago.fecha_vencimiento
    ? new Date(pago.fecha_vencimiento).toLocaleDateString("es")
    : "Sin fecha";

  const cuentaSeleccionada = cuentas.find((c) => c.id === selectedCuentaId);

  return (
    <div className="p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {pago.concepto || "Pago sin concepto"}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Vto: {fechaFormato}
          </p>
        </div>
        <p className="text-lg font-bold text-[var(--warning)]">
          ${Number(pago.valor).toLocaleString("es", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <label className="text-xs text-[var(--muted-foreground)] block">
          Asignar a cuenta:
        </label>
        <select
          value={selectedCuentaId || ""}
          onChange={(e) => setSelectedCuentaId(e.target.value ? Number(e.target.value) : null)}
          disabled={loading}
          className="w-full px-2 py-1.5 text-sm rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] disabled:opacity-50"
        >
          <option value="">Selecciona una cuenta...</option>
          {cuentas.map((cuenta) => (
            <option key={cuenta.id} value={cuenta.id}>
              {cuenta.nombre}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-xs text-[var(--destructive)] mt-2">❌ {error}</p>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleReasignar}
            disabled={loading || !selectedCuentaId}
            className="flex-1 px-3 py-1.5 text-sm rounded bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => setSelectedCuentaId(null)}
            disabled={loading}
            className="flex-1 px-3 py-1.5 text-sm rounded bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
