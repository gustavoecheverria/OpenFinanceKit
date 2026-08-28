import { PageHeader } from "@/components/layout/page-header";
import { addPago } from "../actions";

export default function NuevoPagoPage() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <PageHeader title="Nuevo pago" />

      <form action={addPago} className="space-y-4">
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
        >
          Guardar pago
        </button>
      </form>
    </>
  );
}
