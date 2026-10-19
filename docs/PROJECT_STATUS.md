# OpenFinanceKit — Estado del Proyecto

**Última actualización:** 2026-10-19
**Rama del documento:** `main`

| | Versión | Rama | Estado |
|---|---------|------|--------|
| **Producción** | v0.3.0 | `main` | 🟢 Estable — desplegado el 2026-10-17 |
| **UAT** | v0.3.0 | `develop` | 🟢 Al día con producción |

---

## TL;DR para quien llega nuevo

- La app web funciona y está en producción desde el **2 de septiembre**.
- El **17 de octubre** se liberó **v0.3.0**: pagos programados, transferencias entre
  cuentas, saldos por cuenta, detalle de cuenta y edición de ingresos/gastos.
- Queda **un solo criterio de aceptación abierto**, AC-018 (aislamiento RLS con dos
  usuarios). No bloquea el release.
- El proyecto es de una sola persona con un agente de IA (Kiro) ordenando el flujo.
- La documentación de este repo se mantuvo al día recién el 2026-10-16. Si algo de lo
  que lees contradice el código, el código manda: ver
  [Regla de mantenimiento](#regla-de-mantenimiento).

---

## Qué hay hoy, módulo por módulo

### En producción (v0.3.0)

| Módulo | Ruta | Estado |
|--------|------|--------|
| Login | `/login` | 🟢 Magic link + Google OAuth |
| Dashboard — 6 indicadores | `/dashboard` | 🟢 Con selector de mes |
| Ingresos | `/ingresos` | 🟢 Alta y listado |
| Gastos | `/gastos` | 🟢 Alta, listado y filtros |
| Configuración | `/config` | 🟢 Categorías y cuentas |
| Pagos programados | `/pagos` | 🟢 Lista, countdown, vencimientos |
| Crear pago programado | `/pagos/programado/nuevo` | 🟢 |
| Detalle de cuenta | `/cuentas/[id]` | 🟢 |
| Transferir entre cuentas | `/cuentas/transferir` | 🟢 |
| Editar ingreso / gasto | `/ingresos/nuevo`, `/gastos/nuevo` | 🟢 Modal centrado |
| PWA | — | 🟢 Instalable, con iconos PNG |

### Retirado

| Módulo | Qué pasó |
|--------|----------|
| Pagos únicos (`/pagos/nuevo`) | **Eliminado.** La tabla `pagos` se dropeó en la migración `008`. Reemplazado por pagos programados |

---

## Ambiente

| Ambiente | Rama | URL | Versión |
|----------|------|-----|---------|
| Producción | `main` | https://open-finance-kit.vercel.app | v0.3.0 |
| UAT | `develop` | https://openfinancekit-uat.vercel.app | v0.3.0 |
| Local | cualquiera | `http://localhost:3000` | — |

Ambos despliegues salen de Vercel automáticamente en cada push. Detalle en
[`ENVIRONMENTS.md`](ENVIRONMENTS.md).

---

## Calidad

| Suite | Herramienta | Cantidad | Estado |
|-------|-------------|----------|--------|
| Unitarios | Vitest | 102 tests, 19 grupos | 🟢 Pasan |
| E2E | Playwright | 24 tests, 2 proyectos (48 ejecuciones) | 🟢 Pasan |

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

### Después de v0.3.0

| # | Tarea | Prioridad |
|---|-------|-----------|
| 1 | Cerrar AC-018: aislamiento RLS con dos usuarios | 🟡 Media |
| 2 | Montar CI (lint + tests + E2E) — Sprint 5 | 🟡 Media |
| 3 | Actualizar capturas de pagos programados y transferencias | 🟢 Baja |
| 4 | Revisar `docs/ENVIRONMENTS.md` si cambian las URLs de Vercel | 🟢 Baja |

### Criterios de aceptación de pagos programados

| ID | Estado | Evidencia |
|----|--------|-----------|
| AC-013 | ✅ Cerrado | E2E: la fila sigue en la DB con `activo = false` |
| AC-014 | ✅ Cerrado | E2E: se siembran 51 pagos y se listan los 51 |
| AC-017 | ✅ Cerrado | E2E en `mobile-chrome`: sin scroll horizontal y botón en viewport |
| AC-018 | ⏳ Abierto | Falta E2E con dos usuarios y un segundo `storageState` |

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
main (producción, v0.3.0, 2026-10-17)
  ↑  ← release v0.3.0
  │
develop (UAT)
  ├─ merge feature/pagos-programados      (2026-10-07)
  ├─ merge bugfix/iconos-pwa              (2026-10-06)
  ├─ merge feature/editar-ingresos-gastos (2026-10-05)
  ├─ merge feature/detalle-cuenta         (2026-10-05)
  ├─ merge feature/saldo-actual-config    (2026-10-05)
  └─ merge feature/filtros-gastos         (2026-10-05)
```

Todas las `feature/*` están mergeadas. No hay trabajo encerrado en ramas.

**Tags existentes:** `v0.1.0`, `v0.2.0` (recuperado) y `v0.3.0` (2026-10-17).

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