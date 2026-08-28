/**
 * Badge que indica el ambiente actual (local / uat).
 * No se muestra en producción para no ensuciar la vitrina.
 * Lee NEXT_PUBLIC_APP_ENV (definida por ambiente en Vercel / .env.local).
 */
export function EnvBadge() {
  const env = process.env.NEXT_PUBLIC_APP_ENV;

  // En producción (o si no está definido) no se muestra nada.
  if (!env || env === "production") return null;

  const estilos: Record<string, string> = {
    local: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    uat: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };

  return (
    <div
      className="fixed top-2 right-2 z-50 pointer-events-none"
      aria-label={`Ambiente: ${env}`}
    >
      <span
        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
          estilos[env] ?? "bg-[var(--muted)] text-[var(--muted-foreground)]"
        }`}
      >
        {env}
      </span>
    </div>
  );
}
