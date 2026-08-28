"use client";

import { useRouter } from "next/navigation";

/**
 * Selector de mes del Dashboard. Navega cambiando el query param ?mes=YYYY-MM.
 * La navegación (prev/next) usa las funciones puras del Motor, calculadas
 * en el servidor y pasadas como props — este componente solo dispara la ruta.
 */
export function MonthSelector({
  mesActual,
  etiqueta,
  mesAnterior,
  mesSiguiente,
  esMesActual,
}: {
  mesActual: string;
  etiqueta: string;
  mesAnterior: string;
  mesSiguiente: string;
  esMesActual: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-4 bg-[var(--muted)] rounded-lg px-2 py-1.5">
      <button
        onClick={() => router.push(`/dashboard?mes=${mesAnterior}`)}
        className="p-2 rounded-md hover:bg-[var(--background)] transition-colors"
        aria-label="Mes anterior"
      >
        <ChevronLeft />
      </button>

      <span className="text-sm font-medium capitalize">{etiqueta}</span>

      <button
        onClick={() => router.push(`/dashboard?mes=${mesSiguiente}`)}
        disabled={esMesActual}
        className="p-2 rounded-md hover:bg-[var(--background)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mes siguiente"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
