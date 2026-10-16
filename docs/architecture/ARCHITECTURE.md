# OpenFinanceKit

**Documento:** Arquitectura del Sistema
**Versión:** 0.3.0
**Estado:** Vigente
**Release descrito:** v0.3.0 (pendiente de publicar)
**Autor:** Gustavo Echeverría
**Última actualización:** 2026-10-16

---

> **Nota de revisión.** Hasta el 2026-10-16 este documento describía una arquitectura
> empresarial de microservicios: API Gateway, orquestador de servicios, colas de
> mensajes, caché y módulos de contabilidad/facturación/presupuestos. **Nada de eso
> existe en el código.** Es una sola aplicación Next.js contra una base PostgreSQL.
>
> Lo de abajo describe la arquitectura que realmente hay, verificada contra
> `apps/web/src/` y `apps/web/supabase/migrations/`.
>
> La visión de microservicios queda en el [anexo](#anexo-visión-no-implementada).

---

## Visión general

OpenFinanceKit es una aplicación web monolítica con las cálculos financieros aislados en
un módulo puro. Un solo repositorio, un solo deploy, una sola base de datos.

La arquitectura es deliberadamente simple:

```
Navegador (PWA)
     ↓  HTTPS
Vercel — Next.js 15 (App Router)
     ├── Rutas y Server Components     (src/app/)
     ├── Server Actions                (actions.ts de cada módulo)
     ├── Motor — cálculos puros        (src/lib/motor/)   ← sin I/O
     └── Cliente Supabase              (src/lib/supabase/)
                ↓
          Supabase (PostgreSQL + Auth)
```

---

## Capas

### 1. Presentación — `src/app/` y `src/components/`

Next.js App Router. Los componentes de servidor son el valor por defecto; los de cliente
se marcan con `"use client"` y solo se usan donde hace falta estado o interactividad.

| Ruta | Qué hace |
|------|----------|
| `(app)/dashboard/` | Los 6 indicadores y los saldos por cuenta |
| `(app)/ingresos/` | Alta y listado |
| `(app)/gastos/` | Alta, listado y filtros |
| `(app)/pagos/` | Pagos programados y próximos vencimientos |
| `(app)/pagos/programado/nuevo/` | Formulario de pago programado |
| `(app)/cuentas/[id]/` | Detalle de una cuenta |
| `(app)/cuentas/transferir/` | Transferencia entre cuentas |
| `(app)/config/` | Categorías y cuentas |
| `login/`, `auth/callback/` | Autenticación |

El grupo `(app)` son las páginas protegidas: exigen sesión.

### 2. Aplicación — Server Actions

Cada módulo tiene su `actions.ts` con `"use server"` al inicio.
Las Server Actions son la única vía de escritura hacia la base de datos.

Son también donde vive la validación de negocio que necesita leer el estado actual, como
el saldo suficiente antes de una transferencia: eso no se puede expresar como un
`CHECK` de la base porque depende de un cálculo.

### 3. Motor — `src/lib/motor/`

**La regla más importante del proyecto: aquí y en ningún más hay cálculos.**

| Archivo | Responsabilidad |
|---------|-----------------|
| `calculations.ts` | Los indicadores del dashboard y los saldos por cuenta |
| `fechas.ts` | Fechas de vencimiento y cálculo de estados |
| `programados.ts` | Armado de pagos programados: vencimientos, estados, cuenta regresiva |
| `types.ts` | Tipos compartidos entre las dos capas |
| `index.ts` | Capa de I/O: lee de Supabase y llama a las funciones puras |

**El Motor es puro.** Sin I/O, sin Supabase, sin `next/headers`. Por eso `index.ts` está
separado del resto: si un Client Component importara de `index.ts`, arrastraría
`next/headers` al bundle del navegador y Next.js fallaría al build. Los componentes
cliente importan solo de `programados.ts` y `types.ts`.

Esa pureza es lo que permite testear los cálculos sin base de datos: 102 tests unitarios
corren en 2,5 segundos.

**Cuando cambia un cálculo, sus tests se actualizan en el mismo commit.** El Motor es la
superficie más frágil del proyecto: un cambio acá cambia lo que el usuario ve sin que
ninguna otra prueba lo detecte.

### 4. Datos — `src/lib/supabase/`

| Archivo | Propósito |
|---------|-----------|
| `client.ts` | Cliente de navegador |
| `server.ts` | Cliente de servidor, con cookies de sesión |
| `middleware.ts` | Helpers de sesión para el middleware de Next |

**No hay ORM.** El acceso es directo con `@supabase/supabase-js`. Se evaluó Drizzle y se
descartó (ver ADR-WEB-003 en `docs/decisions/DECISIONS.md`).

### 5. Seguridad

| Capa | Mecanismo |
|------|-----------|
| Sesión | Supabase Auth: magic link y Google OAuth |
| Refresh de sesión | `src/middleware.ts`, en cada request |
| Aislamiento de datos | **Row Level Security en la base**, no en el código |
| Variables | `.env.local`, nunca en el repo |

El aislamiento vive en PostgreSQL: todas las tablas tienen `user_id` y las cuatro
políticas de RLS sobre `auth.uid() = user_id` (ADR-WEB-004). Es imposible filtrar datos
ajenos por olvidar un filtro en el código.

---

## Despliegue

| Rama | Ambiente | Trigger |
|------|----------|---------|
| `main` | Producción | Push a `main` |
| `develop` | UAT | Push a `develop` |

Vercel detecta los pushes y despliega. No hay pasos manuales, ni pipelines propios, ni
servidores.

> ⚠️ **No hay CI.** `.github/workflows/` está vacío: ni lint ni tests corren
> automáticamente antes de un merge. Vercel construye, pero no corre la suite de
> Playwright. Es la brecha más conocida del proyecto.

---

## Modelo de datos

Seis tablas, todas con RLS: `categorias`, `cuentas`, `ingresos`, `gastos`,
`pagos_programados`, `transferencias`.

👉 **Referencia completa**: [`DATA_DICTIONARY.md`](../DATA_DICTIONARY.md)

Para el esquema heredado que existió en v0.2.0 y se eliminó en v0.3.0, ver la sección de
tablas eliminadas de ese mismo documento.

---

## Migraciones

SQL plano, aplicado a mano desde el Supabase Dashboard. Sin CLI de Supabase, sin
migraciones automáticas.

👉 **Cómo aplicarlas**: [`apps/web/supabase/migrations/README.md`](../../apps/web/supabase/migrations/README.md)

---

## Testing

| Tipo | Herramienta | Cubre |
|------|-------------|-------|
| Unitario | Vitest | El Motor: cálculos, fechas, estados (102 tests) |
| E2E | Playwright | Flujos completos partiendo de un usuario vacío (27 tests) |

Los E2E corren en modo serial (`workers: 1`, `fullyParallel: false`) porque comparten
estado de base de datos. Guardan video, traza y screenshots de cada test en
`qa/evidence/`.

---

## Estructura del código

```
apps/web/src/
├── app/                    ← Rutas (App Router)
│   ├── (app)/              ← Protegidas
│   ├── auth/callback/
│   └── login/
├── components/             ← account, config, dashboard, forms,
│                             gastos, ingresos, layout, pagos
├── lib/
│   ├── motor/              ← Cálculos puros + tests
│   └── supabase/           ← Clientes y middleware
├── middleware.ts           ← Refresh de sesión
└── ...
```

---

## Anexo: visión no implementada

La investigación de agosto de 2026 Exploró una arquitectura empresarial. **Ninguno de
estos componentes existe:**

| Componente | Estado |
|------------|--------|
| API Gateway | ❌ No implementado |
| Orquestador de servicios | ❌ No implementado |
| Cola de mensajes | ❌ No implementado |
| Caché distribuida | ❌ No implementado |
| Almacenamiento de objetos | ❌ No implementado |
| Microservicios por dominio | ❌ No implementado |
| Open Banking | ❌ No implementado |
| Facturación electrónica | ❌ No implementado |
| API REST o GraphQL pública | ❌ No implementado |

**Por qué no se va a hacer así:** el producto es un gestor de finanzas personales. No hay
carga que justifique separar servicios ni un equipo que los mantenga. La complejidad de
microservicios se paga entera y sin el beneficio correspondiente. Si alguna vez hace
falta, la capa del Motor ya está aislada y es el punto natural de extracción.

---

*Documento verificado contra el código el 2026-10-16.*