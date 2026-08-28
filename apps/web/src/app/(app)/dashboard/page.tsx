import Link from "next/link";
import { calcularMotor, mesActual, desplazarMes, etiquetaMes } from "@/lib/motor";
import { PageHeader } from "@/components/layout/page-header";
import { MonthSelector } from "@/components/dashboard/month-selector";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const params = await searchParams;
  const hoy = mesActual();
  // Validar el mes recibido (formato YYYY-MM); si no es válido usar el actual
  const mes = /^\d{4}-\d{2}$/.test(params.mes ?? "") ? params.mes! : hoy;

  const motor = await calcularMotor(mes);

  // Sin actividad histórica = usuario nuevo (saldo, ingresos y gastos en cero)
  const sinActividad =
    motor.saldoActual === 0 &&
    motor.totalIngresosHist === 0 &&
    motor.totalGastosHist === 0 &&
    motor.pendientePago === 0;

  return (
    <>
      <PageHeader title="Dashboard" />

      <MonthSelector
        mesActual={mes}
        etiqueta={etiquetaMes(mes)}
        mesAnterior={desplazarMes(mes, -1)}
        mesSiguiente={desplazarMes(mes, 1)}
        esMesActual={mes >= hoy}
      />

      <div className="grid grid-cols-2 gap-3">
        <IndicatorCard
          label="Saldo actual"
          value={formatMoney(motor.saldoActual)}
          variant="primary"
        />
        <IndicatorCard
          label="Ingresos del mes"
          value={formatMoney(motor.ingresosMes)}
          variant="success"
        />
        <IndicatorCard
          label="Gastos del mes"
          value={formatMoney(motor.gastosMes)}
          variant="destructive"
        />
        <IndicatorCard
          label="Pendiente por pagar"
          value={formatMoney(motor.pendientePago)}
          variant="warning"
        />
        <IndicatorCard
          label="Disponible restante"
          value={formatMoney(motor.disponibleRestante)}
          variant="default"
        />
        <IndicatorCard
          label="% Gastado"
          value={`${motor.porcentajeGastado}%`}
          variant="default"
        />
      </div>

      {/* Empty state: sin actividad histórica, guiar al usuario */}
      {sinActividad && (
        <div className="mt-6 p-4 rounded-lg border border-dashed border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted-foreground)] mb-3">
            Aún no tienes datos. Empieza configurando tus cuentas y registrando
            tu primer movimiento.
          </p>
          <div className="flex gap-2 justify-center">
            <Link
              href="/config"
              className="px-3 py-1.5 text-sm rounded-lg bg-[var(--muted)] hover:opacity-80 transition-opacity"
            >
              Configuración
            </Link>
            <Link
              href="/gastos/nuevo"
              className="px-3 py-1.5 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
            >
              Registrar gasto
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ── Componentes locales ─────────────────────────────────────────────────

type Variant = "primary" | "success" | "destructive" | "warning" | "default";

function IndicatorCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: Variant;
}) {
  const valueColors: Record<Variant, string> = {
    primary: "text-[var(--primary)]",
    success: "text-[var(--success)]",
    destructive: "text-[var(--destructive)]",
    warning: "text-[var(--warning)]",
    default: "text-[var(--foreground)]",
  };

  return (
    <div className="p-3 bg-[var(--muted)] rounded-lg">
      <p className="text-xs text-[var(--muted-foreground)] mb-1">{label}</p>
      <p className={`text-lg font-bold ${valueColors[variant]}`}>{value}</p>
    </div>
  );
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("es", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
