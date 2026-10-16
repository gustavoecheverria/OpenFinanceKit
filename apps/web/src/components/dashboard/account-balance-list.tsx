import type { SaldoCuenta } from "@/lib/motor";
import Link from "next/link";

interface AccountBalanceListProps {
  cuentas: SaldoCuenta[];
}

/**
 * Muestra una lista de tarjetas con el saldo de cada cuenta.
 * Cada tarjeta es clickeable y lleva a /cuentas/[id] para ver el detalle.
 * Server Component — no usa hooks de cliente.
 * RN-003: Solo visualiza, no calcula.
 */
export function AccountBalanceList({ cuentas }: AccountBalanceListProps) {
  if (!cuentas || cuentas.length === 0) {
    return (
      <div className="mt-6 p-4 rounded-lg border border-dashed border-[var(--border)] text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          No tienes cuentas registradas.
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Ve a{" "}
          <a href="/config" className="text-[var(--primary)] hover:underline">
            Configuración
          </a>
          {" "}para agregar una.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3 uppercase tracking-wide">
        Tus cuentas
      </h2>

      {/* Grid responsive: 1 columna en móvil, 2 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {cuentas.map((cuenta) => (
          <AccountBalanceCard key={cuenta.id} cuenta={cuenta} />
        ))}
      </div>

      {/* Nota sobre pagos sin cuenta asignada */}
      <div className="text-xs text-[var(--muted-foreground)] mt-2 p-2 bg-[var(--muted)] rounded border-l-2 border-[var(--warning)]">
        📌 <strong>Nota:</strong> Los pagos sin cuenta asignada no aparecen aquí.
      </div>
    </section>
  );
}

// ── Componente local: Tarjeta de una cuenta ────────────────────────────────────

interface AccountBalanceCardProps {
  cuenta: SaldoCuenta;
}

function AccountBalanceCard({ cuenta }: AccountBalanceCardProps) {
  // Lógica de color según el saldo:
  // Verde:    saldo >= 50% del inicial
  // Amarillo: saldo entre 0% y 49% del inicial
  // Rojo:     saldo < 0
  const porcentajeSaldo =
    cuenta.saldoInicial > 0
      ? (cuenta.saldoActual / cuenta.saldoInicial) * 100
      : 0;

  let colorIndicador = "text-[var(--success)]";
  if (cuenta.saldoActual < 0) {
    colorIndicador = "text-[var(--destructive)]";
  } else if (porcentajeSaldo < 50) {
    colorIndicador = "text-[var(--warning)]";
  }

  return (
    <Link
      href={`/cuentas/${cuenta.id}`}
      className="block p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)] hover:opacity-80 hover:border-[var(--primary)] transition-all"
    >
      <p className="text-xs text-[var(--muted-foreground)] mb-1">{cuenta.nombre}</p>
      <p className={`text-lg font-bold ${colorIndicador}`}>
        ${cuenta.saldoActual.toLocaleString("es", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
        Inicial: ${cuenta.saldoInicial.toLocaleString("es", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </Link>
  );
}
