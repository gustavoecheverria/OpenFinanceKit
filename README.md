# OpenFinanceKit (OFK)

**Versión:** 0.2.0 · **Estado:** Activo · **Autor:** Gustavo Echeverría

Sistema de gestión financiera personal. Registra ingresos, gastos y pagos. Visualiza tu estado financiero en un dashboard. Accesible desde cualquier dispositivo como Progressive Web App (PWA).

---

## ¿Qué es esto?

OpenFinanceKit comenzó como un archivo Excel y evolucionó a una aplicación web completa. Hoy tienes dos productos funcionando:

| Producto | Estado | Descripción |
|---------|--------|-------------|
| **OFK Web** | ✅ Activo | App web + PWA instalable en celular |
| **OFK Excel** | ✅ Referencia | Archivo original de diseño (`product/excel/`) |

---

## La app en vivo

| Ambiente | URL | Rama | Propósito |
|----------|-----|------|-----------|
| **Producción** | URL de Vercel (main) | `main` | Versión estable |
| **UAT** | URL de Vercel (develop) | `develop` | Versión de pruebas y mejoras |

---

## Stack tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | Next.js 15 (App Router) | Full-stack, SSR, Server Actions |
| Lenguaje | TypeScript 5 | Tipos estrictos, menos bugs |
| Estilos | Tailwind CSS 4 + shadcn/ui | Mobile-first, componentes accesibles |
| Base de datos | Supabase (PostgreSQL) | DB + Auth + API en un servicio gratuito |
| ORM | Drizzle ORM | Queries type-safe |
| Autenticación | Supabase Auth | Email magic link + Google OAuth |
| Deploy | Vercel | CI/CD automático desde Git |
| Tests unitarios | Vitest | Para lógica del Motor financiero |
| Tests E2E | Playwright | Para flujos de usuario completos |

---

## Estructura del proyecto

```
OpenFinanceKit/
├── apps/
│   └── web/                    ← La app web (Next.js)
│       ├── src/
│       │   ├── app/            ← Páginas y rutas (App Router)
│       │   │   ├── (app)/      ← Páginas protegidas (requieren login)
│       │   │   │   ├── dashboard/  ← Los 6 indicadores financieros
│       │   │   │   ├── ingresos/   ← Registro y lista de ingresos
│       │   │   │   ├── gastos/     ← Registro y lista de gastos
│       │   │   │   ├── pagos/      ← Pagos programados
│       │   │   │   └── config/     ← Categorías y cuentas
│       │   │   ├── auth/       ← Callback de autenticación
│       │   │   └── login/      ← Pantalla de login
│       │   ├── components/     ← Componentes reutilizables
│       │   └── lib/
│       │       ├── motor/      ← Lógica de cálculos financieros
│       │       └── supabase/   ← Cliente de base de datos
│       ├── e2e/                ← Tests E2E (Playwright)
│       ├── supabase/           ← Migraciones de base de datos
│       ├── DEPLOY.md           ← Guía de deploy a Vercel
│       └── DEVELOPMENT.md      ← Setup en dispositivo nuevo
├── docs/                       ← Documentación técnica
│   ├── architecture/           ← Arquitectura del sistema
│   ├── decisions/              ← Decisiones técnicas (ADRs)
│   └── qa/istqb/               ← Estándar de pruebas ISTQB
├── qa/                         ← Evidencia de pruebas
│   ├── evidence/               ← Screenshots y videos (generado)
│   └── reports/                ← Reportes HTML de Playwright (generado)
├── product/excel/              ← OFK Excel original (referencia)
└── .kiro/                      ← Configuración del agente IA
    └── steering/               ← Instrucciones de los agentes
```

---

## Cómo levantar el proyecto localmente

### Requisitos

- Node.js 20+
- Git
- Cuenta en Supabase (gratuita)

### Pasos

```bash
# 1. Clonar el repositorio
git clone git@github.com:gustavoecheverria/OpenFinanceKit.git
cd OpenFinanceKit

# 2. Ir a la app web
cd apps/web

# 3. Instalar dependencias
npm install

# 4. Copiar el archivo de variables de entorno
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_APP_ENV=local
```

```bash
# 5. Levantar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:3000`.

> Guía completa de setup: `apps/web/DEVELOPMENT.md`

---

## Comandos disponibles

Todos se ejecutan desde `apps/web/`:

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servir el build de producción
npm run lint         # Verificar calidad de código
npm run test         # Tests unitarios (Motor financiero)
npm run test:e2e     # Tests E2E con Playwright
```

---

## Cómo funciona la app

El flujo de datos sigue esta arquitectura:

```
Configuración (categorías, cuentas)
        ↓
Ingresos / Gastos / Pagos  ← el usuario registra aquí
        ↓
Motor (calculations.ts)    ← todos los cálculos viven aquí
        ↓
Dashboard                  ← solo visualiza, no calcula
```

**Reglas que no se rompen nunca:**
- Solo el Motor calcula — las páginas de captura solo guardan datos
- Solo Configuración es fuente de datos maestros (categorías, cuentas)
- El Dashboard nunca almacena información propia

---

## Cómo hacer cambios sin IA

### Agregar una nueva pantalla

1. Crear la carpeta en `src/app/(app)/mi-pantalla/`
2. Crear `page.tsx` como Server Component
3. Si necesita formulario, crear `actions.ts` con `"use server"` al inicio
4. Agregar el link de navegación en `src/components/layout/bottom-nav.tsx`

### Agregar un campo nuevo a una tabla

1. Crear un archivo en `supabase/migrations/` con el SQL del `ALTER TABLE`
2. Ejecutar la migración en Supabase Dashboard → SQL Editor
3. Actualizar el schema TypeScript en `src/db/schema.ts` si existe
4. Actualizar el formulario y la action correspondiente

### Modificar un cálculo del Motor

El Motor vive en `src/lib/motor/calculations.ts`. Cada función tiene tests en `calculations.test.ts`. Al modificar:

1. Editar la función en `calculations.ts`
2. Ejecutar `npm run test` para verificar que no se rompió nada
3. Si el resultado cambia, actualizar el test correspondiente

### Correr los tests E2E y ver evidencia

```bash
# Correr en modo visual (ves el navegador)
npx playwright test --headed --project=chromium

# Ver la interfaz completa de Playwright
npx playwright test --ui

# Ver el reporte HTML tras correr los tests
# Abrir: qa/reports/playwright/index.html

# Ver screenshots paso a paso
# Carpeta: qa/evidence/steps/
```

---

## Ramas y flujo de trabajo

```
main       ← Producción. Solo recibe merges aprobados.
  └── develop ← UAT. Todo el trabajo nuevo va aquí.
        └── feature/nombre ← Una rama por cada cambio.
```

### Flujo para un cambio

```bash
# 1. Partir siempre desde develop
git checkout develop
git pull origin develop

# 2. Crear tu rama
git checkout -b feature/mi-cambio

# 3. Hacer los cambios, commitear
git add archivo.ts
git commit -m "feat(modulo): descripción del cambio"

# 4. Subir la rama
git push -u origin feature/mi-cambio

# 5. Cuando esté listo, merge a develop
git checkout develop
git merge feature/mi-cambio --no-ff
git push origin develop
```

### Formato de commits

```
tipo(módulo): descripción en español

Tipos: feat | fix | docs | test | chore | refactor
```

Ejemplos:
```
feat(gastos): agregar campo de etiquetas
fix(motor): corregir cálculo de % gastado
docs(readme): actualizar guía de comandos
test(e2e): agregar test de flujo de pagos
```

---

## Base de datos

La DB vive en Supabase. Las tablas son:

| Tabla | Contenido |
|-------|-----------|
| `categorias` | Tipos de ingreso/gasto del usuario |
| `cuentas` | Cuentas con saldo inicial |
| `ingresos` | Registros de ingresos |
| `gastos` | Registros de gastos |
| `pagos` | Pagos programados con estado |

Todas las tablas tienen **Row Level Security (RLS)** activo: cada usuario solo ve sus propios datos.

El schema completo está en `apps/web/supabase/migrations/001_initial_schema.sql`.

---

## Deploy

- Cada `git push` a `develop` → deploy automático a **UAT** en Vercel
- Cada `git push` a `main` → deploy automático a **Producción** en Vercel
- No hay que hacer nada manual — Vercel lo hace solo

> Guía detallada: `apps/web/DEPLOY.md`

---

## Documentación técnica

| Documento | Dónde |
|-----------|-------|
| Arquitectura del sistema | `docs/architecture/ARCHITECTURE.md` |
| Reglas de negocio | `docs/BUSINESS_RULES.md` |
| Decisiones técnicas (ADRs) | `docs/decisions/DECISIONS.md` |
| Setup en dispositivo nuevo | `apps/web/DEVELOPMENT.md` |
| Guía de deploy | `apps/web/DEPLOY.md` |
| Roadmap | `docs/roadmap/ROADMAP.md` |

---

## Licencia

MIT — ver [LICENSE](./LICENSE)
