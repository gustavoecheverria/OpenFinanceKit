# OpenFinanceKit (OFK)

**Versión en desarrollo:** 0.3.0 (pendiente de release) · **En producción:** 0.2.0
**Estado:** Activo · **Autor:** Gustavo Echeverría · **Última actualización:** 2026-10-16

Sistema de gestión financiera personal. Registra ingresos, gastos, pagos programados y
transferencias entre cuentas. Visualiza tu estado financiero en un dashboard.
Accesible desde cualquier dispositivo como Progressive Web App (PWA).

> **¿Quieres saber qué hay hoy?** Empieza por
> [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md). Está al día y es el único punto
> de entrada al estado real del proyecto.

---

## ¿Qué es esto?

OpenFinanceKit comenzó como un archivo Excel y evolucionó a una aplicación web completa.

| Producto | Estado | Descripción |
|---------|--------|-------------|
| **OFK Web** | ✅ Activo | App web + PWA instalable en celular |
| **OFK Excel** | 📦 Referencia | Archivo original de diseño (`product/excel/`), ya no se desarrolla |

---

## Estado actual

### En producción (v0.2.0, rama `main`)

- Autenticación: email magic link + Google OAuth
- Dashboard con 6 indicadores y selector de mes
- Registro y listado de ingresos y gastos
- Configuración de categorías y cuentas
- PWA instalable

### En UAT (v0.3.0 pendiente, rama `develop`)

Todo lo anterior, más:

- **Pagos programados** — plantillas recurrentes (mensual/quincenal/semanal) que se
  renuevan solas. Al marcar "pagado" generan el registro real en gastos o ingresos.
- **Transferencias entre cuentas** — con "Efectivo" como una cuenta más de la lista
- **Saldos por cuenta** y **detalle de cuenta**
- **Edición de ingresos y gastos**

`develop` está **31 commits adelante** de `main`. El release está pendiente de aprobación.

---

## La app en vivo

| Ambiente | Rama | Propósito |
|----------|------|-----------|
| **Producción** | `main` | Versión estable (v0.2.0) |
| **UAT** | `develop` | Lo que se está construyendo (v0.3.0) |
| **Local** | `feature/*` | `npm run dev` |

URLs y detalles: [`docs/ENVIRONMENTS.md`](docs/ENVIRONMENTS.md)

---

## Stack tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | Next.js 15 (App Router) | Full-stack, SSR, Server Actions |
| Lenguaje | TypeScript 5 | Tipos estrictos, menos bugs |
| Estilos | Tailwind CSS 4 | Mobile-first |
| Base de datos | Supabase (PostgreSQL) | DB + Auth en un solo servicio |
| Acceso a datos | `@supabase/supabase-js` + `@supabase/ssr` | Queries directas, sin ORM |
| Autenticación | Supabase Auth | Email magic link + Google OAuth |
| Despliegue | Vercel | Deploy automático desde Git |
| Tests unitarios | Vitest | Lógica del Motor |
| Tests E2E | Playwright | Flujos de usuario completos |

> **Nota:** este proyecto **no usa Drizzle ORM ni shadcn/ui**. Ambos aparecen en
> versiones anteriores de este README y nunca estuvieron en `package.json`. Los
> componentes son propios, en `src/components/`.

---

## Estructura del proyecto

```
OpenFinanceKit/
├── apps/
│   └── web/                       ← La app web (Next.js)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (app)/         ← Páginas protegidas (requieren login)
│       │   │   │   ├── dashboard/     ← Los 6 indicadores financieros
│       │   │   │   ├── ingresos/      ← Listado y alta de ingresos
│       │   │   │   ├── gastos/        ← Listado y alta de gastos
│       │   │   │   ├── pagos/         ← Pagos programados y vencimientos
│       │   │   │   ├── cuentas/       ← Detalle de cuenta y transferencias
│       │   │   │   └── config/        ← Categorías y cuentas
│       │   │   ├── auth/callback/     ← Callback de autenticación
│       │   │   └── login/             ← Pantalla de login
│       │   ├── components/        ← Componentes por módulo
│       │   └── lib/
│       │       ├── motor/         ← Cálculos financieros (con tests)
│       │       └── supabase/      ← Clientes y middleware de Supabase
│       ├── e2e/                   ← Tests E2E (Playwright)
│       ├── supabase/
│       │   ├── migrations/        ← SQL de la base de datos
│       │   └── scripts/           ← Respaldo y limpieza de datos de prueba
│       ├── DEPLOY.md              ← Guía de deploy a Vercel
│       └── DEVELOPMENT.md         ← Setup en dispositivo nuevo
├── docs/                          ← Documentación técnica (empieza por PROJECT_STATUS.md)
├── qa/                            ← Evidencia y reportes de pruebas
├── product/excel/                 ← OFK Excel original (referencia histórica)
├── scripts/                       ← Automatización en Python
└── .kiro/                         ← Configuración de los agentes IA
```

---

## Cómo levantar el proyecto localmente

### Requisitos

- Node.js 20+
- Git
- Una instancia de Supabase (el plan gratuito sirve)

### Pasos

```bash
git clone git@github.com:gustavoecheverria/OpenFinanceKit.git
cd OpenFinanceKit/apps/web

npm install
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_APP_ENV=local
```

Aplica las migraciones de la base de datos siguiendo
[`apps/web/supabase/migrations/README.md`](apps/web/supabase/migrations/README.md),
y luego:

```bash
npm run dev
```

La app queda en `http://localhost:3000`.

> Guía completa de setup: `apps/web/DEVELOPMENT.md`

---

## Comandos disponibles

Todos se ejecutan desde `apps/web/`:

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servir el build de producción
npm run lint         # Verificar calidad de código
npm run test         # Tests unitarios del Motor
npm run test:e2e     # Tests E2E con Playwright
```

---

## Cómo funciona la app

```
Configuración (categorías, cuentas)
        ↓
Ingresos / Gastos / Pagos programados / Transferencias   ← el usuario registra aquí
        ↓
Motor (src/lib/motor/)              ← todos los cálculos viven aquí
        ↓
Dashboard                              ← solo visualiza, no calcula
```

**Reglas que no se rompen nunca:**

- Solo el Motor calcula — las páginas de captura solo guardan datos
- Solo Configuración es fuente de datos maestros (categorías, cuentas)
- El Dashboard nunca almacena información propia

Detalle: [`docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md)

---

## Base de datos

| Tabla | Contenido |
|-------|-----------|
| `categorias` | Tipos de ingreso/gasto del usuario |
| `cuentas` | Cuentas con saldo inicial |
| `ingresos` | Movimientos de ingreso |
| `gastos` | Movimientos de gasto |
| `pagos_programados` | Plantillas de pagos recurrentes |
| `transferencias` | Movimientos de saldo entre cuentas |

Todas tienen **Row Level Security** activo: cada usuario solo ve sus propios datos.

> La tabla `pagos` (pagos únicos) existió entre v0.2.0 y v0.3.0 y fue eliminada.
> Ver la migración `008_eliminar_pagos_unicos.sql`.

Diccionario completo: [`docs/DATA_DICTIONARY.md`](docs/DATA_DICTIONARY.md)

---

## Ramas y flujo de trabajo

```
main       ← Producción. Solo recibe merges aprobados.
  └── develop ← UAT. Todo el trabajo nuevo va aquí.
        └── feature/nombre ← Una rama por cada cambio.
```

```bash
git checkout develop && git pull origin develop
git checkout -b feature/mi-cambio

# ... hacer los cambios ...

git add archivo.ts
git commit -m "feat(modulo): descripción del cambio"
git push -u origin feature/mi-cambio

git checkout develop
git merge feature/mi-cambio --no-ff
git push origin develop
```

### Commits

```
tipo(módulo): descripción en español

Tipos:  feat | fix | docs | test | chore | refactor
Alcance: web | pagos | motor | auth | config | qa | docs | steering | spec | migrations
```

Ejemplos:
```
feat(web): agregar filtro por categoría en gastos
fix(motor): corregir cálculo de % gastado
docs(spec): agregar SDD feature-dashboard-v2
```

**Regla del proyecto:** la documentación se actualiza **en el mismo commit** que el
código que la cambia. Si agregas una tabla, actualiza el diccionario de datos; si
cambias un módulo, actualiza `PROJECT_STATUS.md`. Ver
[`.kiro/steering/workflow.md`](.kiro/steering/workflow.md).

---

## Deploy

- Cada `git push` a `develop` → deploy automático a **UAT** en Vercel
- Cada `git push` a `main` → deploy automático a **Producción** en Vercel
- No hay pasos manuales. Vercel lo hace solo
- **No hay CI con tests.** `.github/workflows/` está vacío: hoy nadie corre la suite
  automáticamente antes de un merge

> Guía detallada: `apps/web/DEPLOY.md`

---

## Documentación

| Documento | Qué te dice |
|-----------|-------------|
| [Estado del proyecto](docs/PROJECT_STATUS.md) | **Empieza aquí.** Qué hay, en qué ambiente, qué falta |
| [Changelog](docs/changelog/CHANGELOG.md) | Qué cambió en cada versión |
| [Reglas de negocio](docs/BUSINESS_RULES.md) | Las reglas del dominio que el código respeta |
| [Diccionario de datos](docs/DATA_DICTIONARY.md) | Cada tabla y cada campo |
| [Arquitectura](docs/architecture/ARCHITECTURE.md) | Cómo encaja todo |
| [Ambientes](docs/ENVIRONMENTS.md) | URLs y configuración por ambiente |
| [Roadmap](docs/roadmap/ROADMAP.md) | Qué se hizo y qué sigue |
| [Decisiones (ADRs)](docs/decisions/DECISIONS.md) | Por qué se decidió lo que se decidió |
| Setup en dispositivo nuevo | `apps/web/DEVELOPMENT.md` |
| Guía de deploy | `apps/web/DEPLOY.md` |
| Specs de features (SDD) | `.kiro/specs/` — diseño de cada feature |

---

## Cómo colaborar

1. Lee [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) para saber dónde está el proyecto.
2. Lee [`CONTRIBUTING.md`](CONTRIBUTING.md).
3. Todo cambio de código arranca en una rama `feature/*` desde `develop`.
4. Los cambios de datos van en una migración nueva en `apps/web/supabase/migrations/`.
5. La documentación se actualiza en el mismo commit.

---

## Licencia

MIT — ver [LICENSE](./LICENSE)