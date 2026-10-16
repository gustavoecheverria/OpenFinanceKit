import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { GastosListClient } from "@/components/gastos/gastos-list-client";

export default async function GastosPage({
  searchParams,
}: {
  searchParams: Promise<{ cuenta?: string; mes?: string; page?: string }>;
}) {
  const params = await searchParams;
  const cuentaId = params.cuenta ? Number(params.cuenta) : null;
  const mes = params.mes || new Date().toISOString().slice(0, 7);
  const page = params.page ? Number(params.page) : 1;
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Obtener todas las categorías y cuentas para los selects del modal
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .eq("user_id", user.id)
    .order("nombre");

  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("id, nombre")
    .eq("user_id", user.id)
    .order("nombre");

  // Construir query
  let query = supabase
    .from("gastos")
    .select("*, categorias(nombre), cuentas(nombre)", { count: "exact" })
    .eq("user_id", user.id);

  if (cuentaId) {
    query = query.eq("cuenta_id", cuentaId);
  }

  // Filtrar por mes
  const mesInicio = `${mes}-01`;
  const mesProximo = new Date(mes + "-01");
  mesProximo.setMonth(mesProximo.getMonth() + 1);
  const mesFin = mesProximo.toISOString().slice(0, 10);

  query = query
    .gte("fecha", mesInicio)
    .lt("fecha", mesFin);

  // Obtener datos
  const { data: gastos, count } = await query
    .order("fecha", { ascending: false })
    .range(offset, offset + pageSize - 1);

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  const nombreMes = new Date(mes + "-15").toLocaleDateString("es", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Gastos"
        action={
          <Link
            href="/gastos/nuevo"
            className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Nuevo
          </Link>
        }
      />

      <GastosListClient
        categorias={categorias || []}
        cuentas={cuentas || []}
        gastos={gastos || []}
      />
    </>
  );
}
