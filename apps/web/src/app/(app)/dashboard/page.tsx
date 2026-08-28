import { calcularMotor } from "@/lib/motor";
import { PageHeader } from "@/components/layout/page-header";

export default async function DashboardPage() {
  const motor = await calcularMotor();

  return (
    <>
      <PageHeader title="Dashboard" />

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
