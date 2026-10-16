# OpenFinanceKit — Estado del Proyecto

**Última actualización:** 2026-10-16
**Rama del documento:** `develop`

| | Versión | Rama | Estado |
|---|---------|------|--------|
| **Producción** | v0.2.0 | `main` | 🟢 Estable — desplegado el 2026-09-02 |
| **UAT** | v0.3.0 *(pendiente)* | `develop` | 🟡 31 commits adelante de `main`, sin liberar |

---

## TL;DR para quien llega nuevo

- La app web funciona y está en producción desde el **2 de septiembre**.
- Entre septiembre y hoy se desarrolló en `develop` un módulo grande: **pagos
  programados** y **transferencias entre cuentas**, más saldos por cuenta, detalle de
  cuenta y edición de ingresos/gastos.
- **Ese trabajo todavía no está en producción.** Falta aprobar el release
  `develop → main`.
- El proyecto es de una sola persona con un agente de IA (Kiro) ordenando el flujo.
- La documentación de este repo se mantuvo al día recién el 2026-10-16. Si algo de lo
  que lees contradice el código, el código manda: ver
  [Regla de mantenimiento](#regla-de-mantenimiento).

---

## Qué hay hoy, módulo por módulo

### En producción (v0.2.0)

| Módulo | Ruta | Estado |
|--------|------|--------|
| Login | `/login` | 🟢 Magic link + Google OAuth |
| Dashboard — 6 indicadores | `/dashboard` | 🟢 Con selector de mes |
| Ingresos | `/ingresos` | 🟢 Alta y listado |
| Gastos | `/gastos` | 🟢 Alta, listado y filtros |
| Configuración | `/config` | 🟢 Categorías y cuentas |
| PWA | — | 🟢 Instalable, con iconos PNG |

### Solo en UAT (v0.3.0 pendiente)

| Módulo | Ruta | Estado |
|--------|------|--------|
| Pagos programados | `/pagos` | 🟡 Lista, countdown, vencimientos |
| Crear pago programado | `/pagos/programado/nuevo` | 🟡 |
| Detalle de cuenta | `/cuentas/[id]` | 🟡 |
| Transferir entre cuentas | `/cuentas/transferir` | 🟡 |
| Editar ingreso / gasto | `/ingresos/nuevo`, `/gastos/nuevo` | 🟡 Modal centrado |

### Retirado

| Módulo | Qué pasó |
|--------|----------|
| Pagos únicos (`/pagos/nuevo`) | **Eliminado.** La tabla `pagos` se dropeó en la migración `008`. Reemplazado por pagos programados |

---

## Ambiente

| Ambiente | Rama | URL | Versión |
|----------|------|-----|---------|
| Producción | `main` | https://open-finance-kit.vercel.app | v0.2.0 |
| UAT | `develop` | https://openfinancekit-uat.vercel.app | v0.3.0 (pendiente) |
| Local | cualquiera | `http://localhost:3000` | — |

Ambos despliegues salen de Vercel automáticamente en cada push. Detalle en
[`ENVIRONMENTS.md`](ENVIRONMENTS.md).

---

## Calidad

| Suite | Herramienta | Cantidad | Estado |
|-------|-------------|----------|--------|
| Unitarios | Vitest | 102 tests, 19 grupos | 🟢 Pasan |
| E2E | Playwright | 27 tests, 6 grupos | 🟢 Pasan |

- **Unitarios** cubren el Motor (`src/lib/motor/`): cálculos de saldos, fechas de
  vencimiento y estados de pagos programados.
- **E2E** cubren el flujo completo partiendo de un usuario vacío: configuración →
  captura → dashboard, CRUD de configuración, pagos programados y transferencias.
- Evidencia (videos, trazas, screenshots): `qa/evidence/`
- Reporte HTML: `qa/reports/playwright/index.html`

### Lo que NO hay

- **No hay CI.** `.github/workflows/` está vacío. Ni lint ni tests corren
  automáticamente antes de un merge. El deploy de Vercel sí es automático, pero
  Vercel no corre la suite de Playwright.
- **No hay cobertura de código** ni umbrales configurados.
- **No hay reporte de QA versionado** ni matriz de trazabilidad criterio↔test.

---

## Qué falta

### Para liberar v0.3.0

| # | Tarea | Prioridad |
|---|-------|-----------|
| 1 | Aprobar y ejecutar el merge `develop → main` | 🔴 Alta |
| 2 | Correr los 4 criterios de aceptación abiertos de pagos programados (ver abajo) | 🟡 Media |
| 3 | Crear el tag `git tag v0.3.0` y la GitHub Release | 🟡 Media |
| 4 | Actualizar `docs/ENVIRONMENTS.md` si cambiaron las URLs de Vercel | 🟢 Baja |

### Criterios de aceptación abiertos de pagos programados

| ID | Qué falta | Cómo se cierra |
|----|-----------|----------------|
| AC-013 | Desactivar un pago no lo borra | Prueba manual en UAT |
| AC-014 | La lista no se corta en 50 | Crear más de 50 y revisar |
| AC-017 | Countdown bien en móvil | Correr el E2E en el proyecto `mobile-chrome` |
| AC-018 | Aislamiento entre usuarios | E2E con dos usuarios distintos |

### Backlog abierto

| Feature | Prioridad | Nota |
|---------|-----------|------|
| Exportar datos (CSV, PDF) | 🟢 Baja | Nunca evangelizado |
| Múltiples usuarios (familia) | 🟢 Baja | El RLS ya lo soporta; falta la UI |
| Pipeline de CI | 🟡 Media | El roadmap lo tenía en Sprint 5; nunca se hizo |
| Reportes básicos | 🟢 Baja | |
| Importación desde Excel | 🟢 Baja | El Excel de referencia podría servir de plantilla |

> El antiguo **"pagos sin asignar"** quedó **cancelado**: la tabla `pagos` que
> originaba el problema ya no existe.

---

## Ramas

```
main (producción, v0.2.0, 2026-09-02)
  ↑  ← 31 commits sin liberar
  │
develop (UAT, v0.3.0)
  ├─ merge feature/pagos-programados      (2026-10-07)
  ├─ merge bugfix/iconos-pwa              (2026-10-06)
  ├─ merge feature/editar-ingresos-gastos (2026-10-05)
  ├─ merge feature/detalle-cuenta         (2026-10-05)
  ├─ merge feature/saldo-actual-config    (2026-10-05)
  └─ merge feature/filtros-gastos         (2026-10-05)
```

Todas las `feature/*` están mergeadas. No hay trabajo encerrado en ramas.

**Solo existe el tag `v0.1.0`.** v0.2.0 se liberó sin tag. Esto se corrige al liberar
v0.3.0.

---

## Stack

Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · Supabase
(PostgreSQL + Auth) · Vercel · Vitest · Playwright

**No usa ORM.** El acceso a datos es con `@supabase/supabase-js` directo.
**No usa shadcn/ui.** Los componentes son propios.

---

## Última actividad

| Fecha | Qué pasó |
|-------|----------|
| 2026-10-10 | Desactivar ≠ eliminar en pagos programados; se destraba el borrado |
| 2026-10-09 | Los E2E pasan a correr desde un usuario vacío |
| 2026-10-09 | Se corrigen textos de UI que mentían |
| 2026-10-09 | Cada pago programado elige su categoría |
| 2026-10-09 | Se elimina el módulo de pagos únicos |
| 2026-10-07 | Se mergea `feature/pagos-programados` a `develop` |
| 2026-10-06 | Migraciones de transferencias y pagos programados |
| 2026-10-05 | Detalle de cuenta, saldos por cuenta, filtros de gastos, editar ingresos/gastos |
| 2026-09-02 | **Release v0.2.0 a producción** |

---

## Regla de mantenimiento

> Si el código y esta documentación se contradicen, **el código gana**. Y entonces
> esta documentación está mal y hay que arreglarla.

Para que no vuelva a pasar, la actualización de documentación es **parte del
trabajo**, no un extra:

| Cambiaste… | Actualiza también… |
|------------|--------------------|
| Una tabla o un campo | `docs/DATA_DICTIONARY.md` + `apps/web/supabase/migrations/README.md` |
| Una regla del dominio | `docs/BUSINESS_RULES.md` |
| Un módulo o una ruta | Este documento + `README.md` |
| El comportamiento de una feature | El SDD en `.kiro/specs/` |
| Una versión | `docs/changelog/CHANGELOG.md` + `package.json` |

El paso es obligatorio en el flujo de trabajo de Kiro
(`.kiro/steering/workflow.md`).

---

## Documentos de referencia

| Documento | Para qué |
|-----------|----------|
| [Changelog](changelog/CHANGELOG.md) | Qué cambió en cada versión |
| [Reglas de negocio](BUSINESS_RULES.md) | Las reglas que el código respeta |
| [Diccionario de datos](DATA_DICTIONARY.md) | Cada tabla y cada campo |
| [Arquitectura](architecture/ARCHITECTURE.md) | Cómo encaja todo |
| [Ambientes](ENVIRONMENTS.md) | URLs y configuración |
| [Roadmap](roadmap/ROADMAP.md) | Qué se hizo y qué sigue |
| [Decisiones (ADRs)](decisions/DECISIONS.md) | Por qué se decidió cada cosa |
| Migraciones | `apps/web/supabase/migrations/README.md` |
| Specs de features | `.kiro/specs/` |
| Convenciones | `.kiro/skills/ofk-conventions.md` |

---

**Autor:** Gustavo Echeverría · **Agente IA:** Kiro
**Repositorio:** https://github.com/gustavoecheverria/OpenFinanceKit