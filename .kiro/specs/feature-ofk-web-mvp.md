# OpenFinanceKit

**Documento:** SDD — feature/ofk-web-mvp

**Versión:** 0.2.0

**Estado:** Draft

**Sprint:** Sprint 2

**Rama:** feature/ofk-web-mvp

**Issue:** N/A

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-27

---

## 1. Resumen

Construir OFK Web: una Progressive Web App (PWA) que permita registrar ingresos, gastos y pagos desde cualquier dispositivo (celular o PC), visualizar el estado financiero en un dashboard, y que se despliegue automáticamente con cada push al repositorio. Reemplaza al Excel como producto de uso diario manteniendo la misma arquitectura y reglas de negocio.

---

## 2. Contexto y motivación

El producto actual (OpenFinanceKit.xlsx) solo vive localmente en el repositorio. Para registrar un gasto, el usuario debe abrir VS Code, editar el Excel con openpyxl o abrirlo manualmente. Esto es impráctico para el uso diario — especialmente desde el celular cuando llega una notificación del banco.

El usuario necesita poder registrar transacciones financieras al instante, desde cualquier lugar, sin depender del entorno de desarrollo.

Si no se implementa: el producto sigue siendo un ejercicio técnico sin utilidad real en el día a día.

---

## 3. Objetivos

- [ ] OBJ-001: App accesible desde cualquier dispositivo via URL (PWA instalable)
- [ ] OBJ-002: Registro rápido de ingresos desde formulario móvil-first
- [ ] OBJ-003: Registro rápido de gastos desde formulario móvil-first
- [ ] OBJ-004: Registro y gestión de pagos programados
- [ ] OBJ-005: Dashboard con los 6 indicadores del MVP (mismo que Excel)
- [ ] OBJ-006: Configuración de categorías y cuentas desde la app
- [ ] OBJ-007: Deploy automático (push → producción) via Vercel
- [ ] OBJ-008: Autenticación básica (solo el dueño accede a sus datos)

---

## 4. Fuera de alcance

- No incluye: Importación automática de extractos bancarios
- No incluye: Notificaciones push
- No incluye: Múltiples monedas
- No incluye: Multi-usuario / compartir con familia
- No incluye: Gráficos o reportes avanzados
- No incluye: Modo offline completo (requiere conexión para guardar)
- No incluye: App nativa (React Native / Flutter)
- No incluye: Integración con bancos o APIs financieras

---

## 5. Diseño técnico

### 5.1 Stack tecnológico

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| Framework | Next.js (App Router) | 15.x | Full-stack, SSR, API routes, PWA nativo |
| Lenguaje | TypeScript | 5.x | Type safety, mejor DX |
| UI | Tailwind CSS + shadcn/ui | 4.x / latest | Mobile-first, componentes accesibles |
| Base de datos | Supabase (PostgreSQL) | - | Free tier 500MB, auth incluido, API auto |
| Acceso a datos | Cliente Supabase (@supabase/ssr) | - | RLS automático, sin ORM (ver ADR-WEB-003) |
| Auth | Supabase Auth | - | Email + Google, session management |
| Deploy | Vercel (Hobby plan) | - | CI/CD automático, gratis, CDN global |
| PWA | next-pwa / manifest.json | - | Instalable en celular sin app store |

### 5.2 Estructura del proyecto

```
OpenFinanceKit/
├── product/excel/              ← Se mantiene como referencia/backup
├── apps/
│   └── web/                    ← OFK Web (Next.js)
│       ├── public/
│       │   ├── manifest.json
│       │   ├── sw.js
│       │   └── icons/
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx           (→ redirect a /dashboard)
│       │   │   ├── (auth)/
│       │   │   │   ├── login/page.tsx
│       │   │   │   └── callback/route.ts
│       │   │   ├── dashboard/page.tsx
│       │   │   ├── ingresos/
│       │   │   │   ├── page.tsx       (lista)
│       │   │   │   └── nuevo/page.tsx (formulario)
│       │   │   ├── gastos/
│       │   │   │   ├── page.tsx
│       │   │   │   └── nuevo/page.tsx
│       │   │   ├── pagos/
│       │   │   │   ├── page.tsx
│       │   │   │   └── nuevo/page.tsx
│       │   │   └── config/
│       │   │       └── page.tsx
│       │   ├── components/
│       │   │   ├── ui/             (shadcn)
│       │   │   ├── forms/
│       │   │   │   ├── income-form.tsx
│       │   │   │   ├── expense-form.tsx
│       │   │   │   └── payment-form.tsx
│       │   │   ├── dashboard/
│       │   │   │   └── indicator-card.tsx
│       │   │   └── layout/
│       │   │       ├── nav-bar.tsx
│       │   │       └── bottom-nav.tsx
│       │   ├── lib/
│       │   │   ├── supabase/
│       │   │   │   ├── client.ts
│       │   │   │   ├── server.ts
│       │   │   │   └── middleware.ts
│       │   │   ├── motor/
│       │   │   │   └── calculations.ts  (lógica del Motor)
│       │   │   └── utils.ts
│       │   ├── db/
│       │   │   ├── schema.ts          (Drizzle schema)
│       │   │   └── queries.ts
│       │   └── types/
│       │       └── index.ts
│       ├── drizzle.config.ts
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── package.json
│       └── .env.local.example
├── docs/                       ← Se mantiene
├── scripts/                    ← Se mantiene
└── ...
```

### 5.3 Modelo de datos (PostgreSQL / Supabase)

```sql
-- Categorías (datos maestros)
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Ingreso', 'Gasto')),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cuentas (datos maestros)
CREATE TABLE cuentas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  saldo_inicial DECIMAL(12,2) NOT NULL DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingresos
CREATE TABLE ingresos (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  cuenta_id INTEGER NOT NULL REFERENCES cuentas(id),
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  descripcion TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gastos
CREATE TABLE gastos (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  cuenta_id INTEGER NOT NULL REFERENCES cuentas(id),
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  descripcion TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pagos programados
CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  concepto TEXT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagado', 'Vencido')),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.4 Reglas de negocio aplicables

| RN | Descripción | Implementación Web |
|----|-------------|-------------------|
| RN-001 | Configuración es la única fuente de datos maestros | Tablas `categorias` y `cuentas` alimentan los selects |
| RN-002 | Motor es la única capa autorizada para cálculos | `lib/motor/calculations.ts` — server-side |
| RN-003 | Dashboard únicamente visualiza información | Página consume datos del Motor, no calcula |
| RN-004 | Las vistas de captura solo almacenan datos | Forms hacen INSERT, no lógica de negocio |
| RN-005 | Las listas desplegables obtienen valores desde Configuración | Selects cargan de tablas `categorias`/`cuentas` |
| RN-006 | Agregar registros no rompe cálculos | Queries dinámicas, sin hardcoding |

### 5.5 Motor — Cálculos (server-side)

El Motor se implementa como función server-side que calcula los indicadores bajo demanda:

```typescript
// lib/motor/calculations.ts
interface MotorResult {
  ingresosMes: number;      // SUM ingresos WHERE mes = mesActual
  gastosMes: number;        // SUM gastos WHERE mes = mesActual
  balanceMes: number;       // ingresosMes - gastosMes
  totalIngresosHist: number; // SUM all ingresos
  totalGastosHist: number;   // SUM all gastos
  saldoActual: number;      // SUM(saldo_inicial) + totalIngresosHist - totalGastosHist
  pendientePago: number;    // SUM pagos WHERE estado = 'Pendiente'
  totalVencido: number;     // SUM pagos WHERE estado = 'Vencido'
  disponibleRestante: number; // saldoActual - pendientePago
  porcentajeGastado: number;  // gastosMes / ingresosMes (0 si no hay ingresos)
}
```

### 5.6 Dashboard — 6 indicadores

| # | Indicador | Fuente Motor | Formato |
|---|-----------|-------------|---------|
| 1 | Saldo actual | `saldoActual` | Moneda |
| 2 | Ingresos del mes | `ingresosMes` | Moneda |
| 3 | Gastos del mes | `gastosMes` | Moneda |
| 4 | Pendiente por pagar | `pendientePago` | Moneda |
| 5 | Disponible restante | `disponibleRestante` | Moneda |
| 6 | % Gastado | `porcentajeGastado` | Porcentaje |

### 5.7 Flujo de datos (equivalente al Excel)

```
Configuración (categorias, cuentas)
         ↓
Ingresos / Gastos / Pagos (forms → DB)
         ↓
Motor (calculations.ts — queries + lógica)
         ↓
Dashboard (visualización)
```

### 5.8 PWA — Configuración

- `manifest.json`: nombre, iconos, theme_color, display: standalone
- Service Worker: cache de assets estáticos, app shell
- Meta tags: viewport, apple-touch-icon, theme-color
- Resultado: instalable en Android/iOS desde el navegador

### 5.9 CI/CD — Deploy automático

```
push a develop → Vercel Preview (URL temporal para validar)
push a main    → Vercel Production (URL pública final)
```

No se requiere configuración de GitHub Actions — Vercel lo hace nativo con la integración de Git.

---

## 6. Criterios de aceptación

- [ ] AC-001: Puedo acceder a la app desde una URL pública (Vercel)
- [ ] AC-002: Puedo instalar la app como PWA en mi celular
- [ ] AC-003: Puedo iniciar sesión con mi email (Supabase Auth)
- [ ] AC-004: Puedo crear categorías (Ingreso/Gasto) y cuentas desde /config
- [ ] AC-005: Puedo registrar un ingreso con categoría, cuenta, valor y fecha
- [ ] AC-006: Puedo registrar un gasto con categoría, cuenta, valor y fecha
- [ ] AC-007: Puedo registrar un pago con concepto, fecha, valor y estado
- [ ] AC-008: El Dashboard muestra los 6 indicadores correctamente calculados
- [ ] AC-009: Los cálculos del Motor son consistentes con los del Excel
- [ ] AC-010: Un push a main despliega automáticamente a producción
- [ ] AC-011: Los datos están protegidos — solo yo veo mis datos (RLS en Supabase)
- [ ] AC-012: La UI es usable en móvil (responsive, touch-friendly)
- [ ] AC-013: La lógica del Motor está cubierta por tests unitarios (Vitest) que pasan
- [ ] AC-014: Existe al menos un test E2E (Playwright) que valida el flujo config → captura → Dashboard
- [ ] AC-015: Los tests se ejecutan con `npm test` (unit) y `npm run test:e2e` (E2E)

---

## 7. Plan de tareas

### Fase 1 — Scaffold y infraestructura

- [ ] TAREA-001: Crear proyecto Next.js en `apps/web/` con TypeScript, Tailwind, App Router
- [ ] TAREA-002: Configurar PWA (manifest.json, service worker, iconos)
- [ ] TAREA-003: Crear proyecto en Supabase y configurar variables de entorno
- [ ] TAREA-004: Definir schema de DB (SQL migrations) y aplicar en Supabase
- [ ] TAREA-005: ~~Configurar Drizzle ORM~~ (descartado — ver ADR-WEB-003, se usa cliente Supabase directo)
- [ ] TAREA-006: Configurar Supabase Auth (email login, middleware de sesión)

### Fase 2 — Core funcional

- [ ] TAREA-007: Implementar layout principal (nav, bottom-nav para móvil)
- [ ] TAREA-008: Implementar página /config (CRUD categorías y cuentas)
- [ ] TAREA-009: Implementar formulario y lista de Ingresos (/ingresos)
- [ ] TAREA-010: Implementar formulario y lista de Gastos (/gastos)
- [ ] TAREA-011: Implementar formulario y lista de Pagos (/pagos)
- [ ] TAREA-012: Implementar Motor (lib/motor/calculations.ts) con queries reales

### Fase 3 — Dashboard y UX

- [x] TAREA-013: Implementar Dashboard con 6 indicator cards (adelantado en Fase 2)
- [ ] TAREA-014: Optimizar UX móvil — desglosada en:
  - [ ] TAREA-014a: Selector de mes en Dashboard (Motor calcula el mes elegido)
  - [ ] TAREA-014b: Estados de carga en formularios (previene doble submit)
  - [ ] TAREA-014c: Manejo de errores amigable (no pantalla de error de Next)
  - [ ] TAREA-014d: Pulido — login centrado + empty states (guiar a Config)
- [ ] TAREA-015: Botón "Cargar datos de ejemplo" (seed opcional dentro de la app)

### Fase 4 — Deploy y validación

- [ ] TAREA-016: Conectar repositorio a Vercel y hacer primer deploy
- [ ] TAREA-017: Configurar Row Level Security (RLS) en Supabase
- [ ] TAREA-018: Validar todos los criterios de aceptación
- [ ] TAREA-019: Probar instalación PWA en celular Android/iOS
- [ ] TAREA-020: Proponer mensaje de commit (hook commit-message)
- [ ] TAREA-021: Esperar aprobación del usuario para merge a develop

### Fase 5 — Testing automatizado

- [ ] TAREA-022: Refactorizar Motor — separar lógica de cálculo pura de las queries (`calcularIndicadores` puro + `obtenerDatosMotor` para I/O)
- [ ] TAREA-023: Configurar Vitest (config, scripts npm, entorno de test)
- [ ] TAREA-024: Tests unitarios del Motor — cubrir los 10 indicadores + casos borde (listas vacías, división por cero)
- [ ] TAREA-025: Configurar Playwright (config, navegadores, entorno de test)
- [ ] TAREA-026: Setup de autenticación de prueba (sesión pre-autenticada para E2E, sin depender del magic link)
- [ ] TAREA-027: Test E2E del flujo principal (config → registrar gasto/ingreso → verificar Dashboard)
- [ ] TAREA-028: Validar criterios de aceptación de testing (AC-013 a AC-015)

---

## 8. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Supabase free tier se pausa tras 1 semana de inactividad | Medio | Usar la app regularmente (que es el objetivo) o configurar un ping periódico |
| Vercel Hobby plan solo para proyectos personales (no comerciales) | Bajo | OFK es personal. Si crece, upgrade a Pro ($20/mes) |
| PWA en iOS tiene limitaciones (no push notifications) | Bajo | No estamos usando push en este MVP |
| Schema de DB cambie durante desarrollo | Bajo | Migrations versionadas en supabase/migrations/ (SQL) |
| Supabase Auth requiere verificar email | Bajo | Usar magic link o deshabilitar confirmación para dev |

---

## 9. Decisiones de arquitectura

### ADR-WEB-001: Monorepo con `apps/web/`

Se coloca la web app dentro de `apps/web/` (no en la raíz) para mantener la estructura del ecosistema OFK. El Excel, docs, y scripts siguen en sus lugares. Futuras apps (mobile, API) irán en `apps/`.

### ADR-WEB-002: Supabase sobre Neon + Auth separado

Supabase incluye DB + Auth + API en un solo servicio gratuito. Usar Neon requeriría agregar autenticación por separado (Clerk, Auth.js) y más integración manual.

### ADR-WEB-003: Sin ORM — cliente Supabase directo (revisado)

Inicialmente se consideró Drizzle ORM, pero durante la revisión de arquitectura (Fase 5) se decidió eliminarlo. El runtime usa el cliente de Supabase (`@supabase/ssr`), que ya respeta RLS automáticamente y cubre todas las queries del MVP. Drizzle solo se habría usado para migraciones, pero estas se gestionan con SQL directo en `supabase/migrations/`. Eliminar el ORM reduce dependencias y complejidad sin perder funcionalidad (principio de simplicidad, RN de no duplicar acceso a datos).

### ADR-WEB-004: PWA sobre app nativa

Una PWA cubre el caso de uso (formulario rápido desde el celular) sin requerir publicar en app stores, aprender Flutter/React Native, o mantener dos codebases. Si la experiencia no es suficiente en el futuro, se puede migrar a React Native compartiendo la lógica.

### ADR-WEB-005: Motor como función server-side, no como API separada

El Motor es una función TypeScript que ejecuta queries y calcula indicadores. No necesita ser un microservicio ni una API separada — Next.js server components y server actions permiten ejecutar esta lógica directamente en el servidor sin endpoint explícito.

### ADR-WEB-006: Separación de lógica pura y I/O en el Motor (para testabilidad)

El Motor se divide en dos partes:
- `obtenerDatosMotor()` — hace las queries a Supabase (I/O, difícil de testear sin DB)
- `calcularIndicadores(datos)` — función pura que recibe los datos y calcula (fácil de testear con Vitest)

Esto permite testear toda la lógica financiera crítica sin necesidad de una base de datos, mock complejo, ni navegador. La función server-side `calcularMotor()` compone ambas.

### ADR-WEB-007: Vitest para unitarios, Playwright para E2E

Vitest se elige por su velocidad, compatibilidad nativa con TypeScript/ESM y cero configuración con Next.js. Playwright para E2E por su soporte multi-navegador, esperas automáticas y capacidad de simular el flujo real de usuario. Ambos son el estándar del ecosistema y ya estaban previstos en `.kiro/skills/ofk-conventions.md`.

### ADR-WEB-008: Autenticación de prueba para E2E sin magic link

El login por magic link requiere leer un email, lo que es frágil en tests automatizados. Para E2E se usa una sesión pre-autenticada (crear usuario de prueba vía Supabase Admin API y almacenar el storageState de Playwright). El producto no se modifica — el bypass vive solo en el entorno de test.

---

## 10. Notas adicionales

- El Excel (`product/excel/OpenFinanceKit.xlsx`) se mantiene en el repo como referencia y backup del diseño original.
- Los datos de producción viven exclusivamente en Supabase. El repo no contiene datos financieros reales.
- El archivo `.env.local` (con keys de Supabase) nunca se commitea — solo se usa `.env.local.example` como referencia.
- La UI prioriza velocidad de entrada: el formulario más usado (gastos) debe requerir máximo 3 taps + teclado numérico.
- Se respeta el principio de simplicidad: no se agrega nada que el MVP no necesite.

---

## Instrucción para Kiro

1. ✅ SDD completado y guardado
2. Crear la rama: `git checkout -b feature/ofk-web-mvp develop`
3. Ejecutar las tareas del Plan en orden (Fase 1 → 2 → 3 → 4)
4. Al finalizar cada tarea, marcarla como completada en este documento
5. Al terminar todas las tareas, ejecutar el hook `commit-message`
6. Presentar los cambios al usuario para validación
7. **No hacer merge a develop sin aprobación del usuario**
8. **No hacer push a GitHub sin autorización explícita**
