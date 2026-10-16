# OpenFinanceKit

**Documento:** Roadmap
**Versión:** 0.3.0
**Estado:** Vigente
**Autor:** Gustavo Echeverría
**Última actualización:** 2026-10-16

---

## Visión

Construir un sistema de gestión financiera modular que sirva a una persona para entender
de un vistazo de dónde viene su dinero y a qué se va. La arquitectura permite que el
mismo núcleo (el Motor y sus reglas) viva hoy en una web y mañana en un móvil, una API
o un Excel, sin reescribir la lógica.

---

## Cómo se numera el tiempo

La numeración de sprints es la de los SDD en `.kiro/specs/`. Es la única que importa.

> La hoja de ruta original de 7 sprints (agosto 2026) estaba pensada para construir el
> MVP en Excel. Se arquivó abajo en [Plan original](#plan-original-archivado) porque su
> secuencia ya no describe el orden real en que se construyó el producto.

---

## Sprints

### Sprint 1 — Fundamentos · agosto 2026 · ✅ Completado

| Entregable | Estado |
|------------|--------|
| Estructura del repositorio y carpetas | ✅ |
| Documentación base: arquitectura, reglas de negocio, diccionario de datos, ADRs, roadmap | ✅ |
| Plantillas de GitHub: issues, PR, historias | ✅ |
| Backlog inicial y tablero de GitHub Projects | ✅ |
| `.kiro/`: agentes especializados (architect, developer, qa, engineer) | ✅ |
| **OFK Excel** — el archivo original de diseño | ✅ (hoy referencia histórica) |

**Resultado:** `product/excel/OpenFinanceKit.xlsx`. Se archivó como referencia cuando
la web lo superó. Ya no se desarrolla.

---

### Sprint 2 — OFK Web MVP · agosto–septiembre 2026 · ✅ Completado

| Entregable | Estado |
|------------|--------|
| Next.js 15 + Supabase + Tailwind, estructura de la app | ✅ |
| Autenticación: email magic link y Google OAuth | ✅ |
| Dashboard con 6 indicadores y selector de mes | ✅ |
| CRUD de ingresos y gastos | ✅ |
| Configuración de categorías y cuentas | ✅ |
| PWA instalable | ✅ |
| Ambientes separados (producción en `main`, UAT en `develop`) | ✅ |
| Deploy en Vercel | ✅ |
| Tests E2E base con Playwright | ✅ |
| Cierre de gaps de seguridad G1–G5 | ✅ |

**Resultado:** **v0.2.0, en producción desde el 2026-09-02.** Sigue siendo la versión
estable.

---

### Sprint 3 — Pagos sin asignar · cancelado

**❌ CANCELADO.** El módulo iba a resolver un descuadre: la tabla `pagos` no tenía
`cuenta_id`, y eso hacía que la suma de saldos por cuenta no cuadrara con el saldo global.

Cancelado porque la tabla `pagos` fue eliminada por completo en la migración `008`
(dentro de v0.3.0). El problema que este sprint iba a resolver ya no existe.

---

### Sprint 4 — Pagos programados y transferencias · octubre 2026 · ✅ Completado, sin liberar

| Entregable | Estado |
|------------|--------|
| Motor: cálculo de fechas de vencimiento y estados | ✅ |
| Tabla `pagos_programados` con recurrencia y cuenta obligatoria | ✅ |
| Estado calculado, no almacenado (sin jobs programados) | ✅ |
| Categoría elegida por el usuario en cada pago programado | ✅ |
| Desactivar ≠ eliminar | ✅ |
| Tabla `transferencias` entre cuentas | ✅ |
| "Efectivo" como cuenta real con saldo propio | ✅ |
| Eliminación del módulo de pagos únicos | ✅ |
| Saldos por cuenta y detalle de cuenta | ✅ |
| Edición de ingresos y gastos | ✅ |
| Filtros de gastos | ✅ |
| Iconos PNG del manifiesto PWA | ✅ |
| 64 tests unitarios + 22 tests E2E nuevos | ✅ |

**Resultado:** v0.3.0, **pendiente de release**. 31 commits en `develop` sin llegar a
`main`.

**SDD:** `.kiro/specs/feature-pagos-programados.md` (4 criterios de aceptación abiertos,
ver `PROJECT_STATUS.md`)

---

### Sprint 5 — Liberar y cerrar · pendiente · 🟡 Es lo siguiente

Lo mínimo para que el proyecto deje de acumular trabajo validado pero no publicado.

| Entregable | Prioridad |
|------------|--------|
| Merge `develop → main` y tag `v0.3.0` | 🔴 |
| Cerrar los 4 criterios de aceptación abiertos | 🟡 |
| Pipeline de CI: lint + unitarios antes de cada merge | 🟡 |
| Reporte de QA versionado con matriz criterio ↔ test | 🟡 |

> **Sobre CI:** Sprint 5 del plan original lo tenía como entregable y nunca se hizo.
> `.github/workflows/` sigue vacío. Hoy nadie corre la suite automáticamente antes de
> mergear. Es la brecha de calidad más grande que tiene el proyecto.

---

### Sprints futuros — sin comprometer · ⚪ Backlog

Nada de esto está planificado ni fechado. Sale del backlog de GitHub.

| Tema | Notas |
|------|-------|
| Exportar datos | CSV, PDF |
| Reportes básicos | Mensual, por categoría |
| Múltiples usuarios | Compartir con familia. El RLS ya lo soporta; falta la UI |
| Importación desde el Excel de referencia | El Excel archivado podría servir de plantilla |
| ONV / modo oscuro | |
| Notificaciones de vencimiento | Push o email. Hoy solo hay alertas dentro de la app |

---

## Ecosistema OFK

```
OpenFinanceKit
├── OFK Excel        ← Referencia histórica (product/excel/)
├── OFK Web          ← Activo. Next.js 15 + Supabase, app PWA
├── OFK Mobile       ← Futuro
├── OFK API          ← Futuro
├── OFK Power BI     ← Futuro
├── OFK AI Assistant ← Futuro
├── OFK Automation   ← Futuro (n8n)
└── OFK Empresa      ← Visión no implementada. Ver el anexo de BUSINESS_RULES.md
```

---

## Plan original (archivado)

Hoja de ruta de 7 sprints del 2026-08-03, diseñada para construir el MVP **en Excel**.
Se conserva como registro histórico. **No describe el orden real en que se construyó
el producto**, y varios entregables (CI, GitHub Actions) nunca se hicieron.

| Sprint | Tema | Qué pasó en realidad |
|--------|------|---------------------|
| 1 | Arquitectura y estructura | ✅ Hecho |
| 2 | Decisiones técnicas y setup | ⚠️ Parcial. Sin GitHub Actions |
| 3 | Modelo de datos y backend base | 🔄 Reformulado. No hubo API REST; el acceso es directo a Supabase |
| 4 | Autenticación y frontend base | ✅ Hecho, pero junto con el MVP completo |
| 5 | QA, testing y DevOps | ⚠️ Parcial. Hay tests, no hay CI |
| 6 | Funcionalidades financieras core | ✅ Hecho |
| 7 | Automatización e inteligencia | ⚪ No iniciado |

---

## Riesgos conocidos

| Riesgo | Impacto | Estado |
|--------|---------|--------|
| `develop` muy adelantado de `main` | Acumulación de trabajo validado y no publicado | 🔴 31 commits |
| Sin CI | Un merge puede romper producción sin que nadie lo note | 🔴 |
| Documentación desalineada del código | Un colaborador nuevo lee cosas falsas | 🟡 Mitigado el 2026-10-16 con el checklist de mantenimiento |
| Release sin tag | `v0.2.0` existe pero no hay tag de git que lo señale | 🟡 Se corrige al liberar v0.3.0 |
| Sin cobertura de código | No se sabe qué partes están realmente testeadas | 🟡 |
| Un solo desarrollador | Sin revisión de código entre personas | 🟡 |

---

## Documentos relacionados

| Documento | Para qué |
|-----------|----------|
| [Estado del proyecto](../PROJECT_STATUS.md) | Qué hay hoy, en qué ambiente, qué falta |
| [Changelog](../changelog/CHANGELOG.md) | Qué cambió en cada versión |
| [Reglas de negocio](../BUSINESS_RULES.md) | Las reglas del dominio |
| [Diccionario de datos](../DATA_DICTIONARY.md) | Cada tabla y cada campo |