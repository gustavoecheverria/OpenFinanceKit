import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { LogoutButton } from "@/components/account/logout-button";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // El nombre puede venir del proveedor (Google) en user_metadata
  const nombre =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <>
      <PageHeader title="Cuenta" />

      {/* Perfil */}
      <section className="flex items-center gap-3 p-4 bg-[var(--muted)] rounded-lg mb-6">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt="Foto de perfil"
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold">
            {(nombre ?? user.email ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          {nombre && <p className="font-medium truncate">{nombre}</p>}
          <p className="text-sm text-[var(--muted-foreground)] truncate">
            {user.email}
          </p>
        </div>
      </section>

      {/* Acciones (por ahora solo cerrar sesión) */}
      <LogoutButton />

      <p className="text-xs text-[var(--muted-foreground)] text-center mt-4">
        Próximamente: editar perfil, preferencias y más.
      </p>
    </>
  );
}
