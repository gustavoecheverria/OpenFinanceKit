"use client";

import Link from "next/link";
import { useCallback } from "react";
import { deleteGasto } from "@/app/(app)/gastos/actions";

interface Cuenta {
  id: number;
  nombre: string;
}

interface GastosListProps {
  cuentaId: number | null;
  mes: string;
  page: number;
  cuentas: Cuenta[];
  nombreMes: string;
  count: number;
  pageSize: number;
  offset: number;
  totalPages: number;
  gastos: any[];
}

export function GastosListClient({
  cuentaId,
  mes,
  page,
  cuentas,
  nombreMes,
  count,
  pageSize,
  offset,
  totalPages,
  gastos,
}: GastosListProps) {
  const buildUrl = useCallback(
    (newParams: Record<string, any>) => {
      const params = new URLSearchParams();

      // Cuenta: usar la nueva si se pasa, sino la actual
      const cuenta =
        "cuenta" in newParams
          ? newParams.cuenta
          : cuentaId;
      if (cuenta) params.set("cuenta", String(cuenta));

      // Mes: usar el nuevo si se pasa, sino el actual
      const mesValue =
        "mes" in newParams
          ? newParams.mes
          : mes;
      params.set("mes", mesValue);

      // Page: usar la nueva si se pasa, sino 1
      const pageValue =
        "page" in newParams
          ? newParams.page
          : 1;
      if (pageValue > 1) params.set("page", String(pageValue));

      return `?${params.toString()}`;
    },
    [cuentaId, mes]
  );

  return (
    <>
      {/* Filtros compactos */}
      <div className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-[var(--muted-foreground)] block mb-1">
            Cuenta
          </label>
          <select
            defaultValue={cuentaId || ""}
            onChange={(e) => {
              window.location.href = buildUrl({
                cuenta: e.target.value || null,
                page: 1,
              });
            }}
            className="w-full px-2 py-1.5 text-sm rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]"
          >
            <option value="">Todas</option>
            {cuentas?.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="text-xs text-[var(--muted-foreground)] block mb-1">
            Mes
          </label>
          <input
            type="month"
            value={mes}
            onChange={(e) => {
              const newMes = e.target.value;
              if (newMes) {
                window.location.href = buildUrl({
                  mes: newMes,
                  page: 1,
                });
              }
            }}
            className="w-full px-2 py-1.5 text-sm rounded bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Info de filtros y total */}
      <div className="mb-3 text-xs text-[var(--muted-foreground)]">
        <p>
          <strong>{nombreMes}</strong>
          {cuentaId && ` · ${cuentas?.find((c) => c.id === cuentaId)?.nombre}`}
          {count !== null && ` · ${count} gasto${count !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Listado de gastos */}
      {gastos && gastos.length > 0 ? (
        <>
          <ul className="space-y-2">
            {gastos.map((gasto: any) => (
              <li
                key={gasto.id}
                className="flex items-center justify-between px-3 py-3 bg-[var(--muted)] rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--destructive)]">
                      -${Number(gasto.valor).toLocaleString("es", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] truncate">
                      {gasto.categorias?.nombre}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {gasto.fecha}
                      </span>
                      {gasto.descripcion && (
                        <span className="text-xs text-[var(--muted-foreground)] truncate">
                          · {gasto.descripcion}
                        </span>
                      )}
                    </div>
                    {gasto.cuentas && (
                      <span className="text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-1.5 py-0.5 rounded truncate ml-2">
                        {gasto.cuentas.nombre}
                      </span>
                    )}
                  </div>
                </div>
                <form action={deleteGasto.bind(null, gasto.id)}>
                  <button
                    type="submit"
                    className="ml-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                    aria-label="Eliminar gasto"
                  >
                    ✕
                  </button>
                </form>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: page - 1 })}
                  className="px-2 py-1 text-xs rounded bg-[var(--muted)] hover:opacity-80 transition-opacity"
                >
                  ← Anterior
                </Link>
              )}

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return p;
              }).map((p) => (
                <Link
                  key={p}
                  href={buildUrl({ page: p })}
                  className={`px-2 py-1 text-xs rounded transition-opacity ${
                    p === page
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--muted)] hover:opacity-80"
                  }`}
                >
                  {p}
                </Link>
              ))}

              {page < totalPages && (
                <Link
                  href={buildUrl({ page: page + 1 })}
                  className="px-2 py-1 text-xs rounded bg-[var(--muted)] hover:opacity-80 transition-opacity"
                >
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          No hay gastos registrados para estos filtros. Toca &quot;+ Nuevo&quot;
          para agregar uno.
        </p>
      )}
    </>
  );
}
