# OpenFinanceKit

**Documento:** Changelog

**Versión del documento:** 0.3.0

**Estado:** Vigente

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-10-16

---

Todos los cambios notables de OpenFinanceKit se documentan aquí.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## Cómo se numeran las versiones

| Concepto | Qué significa |
|----------|---------------|
| `main` | Lo que está en producción. Siempre con tag. |
| `develop` | Lo que se está construyendo. Puede estar por delante de varios releases. |
| Migración SQL | El campo `Release:` indica **en qué versión se publica**, no que ya se haya publicado. |

Por eso las migraciones de `develop` dicen `Release: v0.3.0 (pendiente)`: describen
cambios que todavía no están en producción.

---

## [Unreleased]

Nada todavía.

---

## [v0.3.0] — PENDIENTE DE RELEASE

**Estado:** en `develop`. **No está en producción.** 31 commits adelante de `main`.

### Added

**Pagos programados**
- Plantillas de pagos recurrentes con recurrencia mensual, quincenal o semanal
- El vencimiento se renueva solo: no hay jobs ni tareas programadas
- Estado calculado en cada render: "Al día", "Pendiente", "Alerta", "Vencido"
- Cuenta de origen obligatoria. "Efectivo" es una cuenta más de la lista, con su
  propio saldo
- El pago se registra en la categoría que eligió el usuario, no en la primera que
  encuentra
- Al marcar "pagado" se genera el registro real en `gastos` o `ingresos`
- Dashboard de próximos vencimientos
- Desactivar y reactivar sin borrar el historial

**Transferencias entre cuentas**
- Tabla `transferencias` para mover saldo entre cuentas
- No altera el saldo global: solo redistribuye
- Valida saldo suficiente antes de insertar
- Evita transferir a la misma cuenta

**Cuentas**
- Saldos por cuenta en el dashboard
- Página de detalle por cuenta con resumen y movimientos

**Ingresos y gastos**
- Edición de monto, cuenta y descripción
- Filtros de gastos
- Modales de edición centrados

**PWA**
- Iconos PNG del manifiesto (los placeholders SVG previos no servían en Android)

**Calidad**
- 64 tests unitarios nuevos del Motor (fechas y estados de pagos programados)
- 22 tests E2E nuevos de pagos programados y transferencias
- Los E2E ahora corren desde un usuario vacío
- Script de limpieza de datos de prueba (`supabase/scripts/limpiar-e2e.sql`)

### Removed

- **Módulo de pagos únicos.** La tabla `pagos` (migración `008`) y las pantallas
  `/pagos/nuevo` y `/pagos/sin-asignar` se eliminaron por completo. Nunca funcionó:
  la columna `pagos.cuenta_id` nunca se creó en la base real, así que el formulario
  fallaba siempre. Los 5 pagos pendientes del usuario se convirtieron a mano en pagos
  programados antes de dropear la tabla
- El spec **Pagos Sin Asignar** queda cancelado: el problema que resolvía desapareció
  con la tabla

### Fixed

- Mensajes de UI que describían un comportamiento distinto del real
- El borrado de pagos programados quedaba trabado; ahora desactivar y eliminar son
  operaciones distintas y separadas
- Scroll del body bloqueado por modales centrados

### Changed

- La versión del documento de migraciones pasa de números sueltos (`0.3.0`, `0.4.0`)
  a declarar el release de destino

---

## [v0.2.0] — 2026-09-02

**Estado:** en producción (`main`).

### Added

- OFK Web MVP completo: Next.js 15 + Supabase + PWA
- Autenticación con email magic link y Google OAuth
- Dashboard con 6 indicadores financieros y selector de mes
- Registro y listado de ingresos y de gastos
- Configuración de categorías y cuentas
- Tests E2E con Playwright (autenticación, flujo principal, CRUD de configuración)
- Deploy automático en Vercel con ambientes separados (producción y UAT)
- Guía de setup en dispositivo nuevo
- Cierre de gaps de seguridad G1–G5 detectados en revisión de QA

---

## [v0.1.0] — 2026-08-03

### Added

- Infraestructura inicial del proyecto en GitHub
- Estructura completa de carpetas
- Documentación técnica base: arquitectura, reglas de negocio, diccionario de datos,
  decisiones (ADR-001), hoja de ruta con 7 sprints
- Plantillas de GitHub: historia de usuario, bug, épica, pull request
- Tablero GitHub Projects con flujo Scrum ampliado
- Backlog inicial con 4 épicas y 7 historias de usuario
- **OFK Excel**: archivo original de diseño (`product/excel/OpenFinanceKit.xlsx`),
  hoy referencia histórica

---

[Unreleased]: https://github.com/gustavoecheverria/OpenFinanceKit/compare/v0.3.0...HEAD
[v0.3.0]: https://github.com/gustavoecheverria/OpenFinanceKit/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/gustavoecheverria/OpenFinanceKit/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/gustavoecheverria/OpenFinanceKit/releases/tag/v0.1.0