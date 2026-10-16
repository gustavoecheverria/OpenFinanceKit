# Migraciones de base de datos

## Cómo se aplican

OFK **no usa el CLI de Supabase** para migrar. Son archivos SQL que se ejecutan a
mano desde el **Supabase Dashboard → SQL Editor**, en orden numérico, copiando y
pegando el contenido completo de cada archivo.

> **Regla:** siempre en orden ascendente. Cada archivo depende de que el anterior
> ya está aplicado.

Para una base limpia:

```
001 → 003 → 004 → 005 → 006 → 007 → 008 → 009
```

**Salta la 002.** Ver la tabla de abajo.

---

## Estado de cada migración

| # | Archivo | Qué hace | Release | Estado |
|---|---------|----------|---------|--------|
| 001 | `001_initial_schema.sql` | Crea `categorias`, `cuentas`, `ingresos`, `gastos`, `pagos` + RLS | v0.2.0 | Publicada |
| 002 | `002_pagos_cuenta.sql` | Agregaba `cuenta_id` a `pagos` | — | **Nunca aplicada** |
| 003 | `003_transferencias.sql` | Crea `transferencias` (mover saldo entre cuentas) | v0.3.0 | Pendiente |
| 004 | `004_rls_transferencias.sql` | RLS de `transferencias` | v0.3.0 | Pendiente |
| 005 | `005_pagos_programados.sql` | Crea `pagos_programados` | v0.3.0 | Pendiente |
| 006 | `006_rls_pagos_programados.sql` | RLS de `pagos_programados` | v0.3.0 | Pendiente |
| 007 | `007_quitar_recurrencia_diaria.sql` | Quita la recurrencia `'Diario'` | v0.3.0 | Pendiente |
| 008 | `008_eliminar_pagos_unicos.sql` | **Dropea la tabla `pagos`** | v0.3.0 | Pendiente |
| 009 | `009_categoria_pagos_programados.sql` | Agrega `categoria_id` a `pagos_programados` | v0.3.0 | Pendiente |

### Por qué la 002 está dead

La 002 agregaba `pagos.cuenta_id`. **Nunca se ejecutó en la base real**, así que la
columna nunca existió mientras el código sí intentaba insertarla. El formulario de
pagos fallaba siempre con *"No se pudo guardar el pago. Intenta de nuevo."*

Después la tabla `pagos` completa se eliminó (migración 008), con lo que la 002 quedó
sin objeto. **No la apliques.** Se conserva solo por trazabilidad. La razón completa
está documentada en el encabezado de la 008.

---

## Esquema resultante (post v0.3.0)

| Tabla | Qué guarda |
|-------|-----------|
| `categorias` | Tipos de ingreso/gasto del usuario (datos maestros) |
| `cuentas` | Cuentas con saldo inicial (datos maestros) |
| `ingresos` | Movimientos de ingreso |
| `gastos` | Movimientos de gasto |
| `pagos_programados` | Plantillas de pagos recurrentes |
| `transferencias` | Movimientos de saldo entre cuentas |

`pagos` ya no existe. Todos los registros tienen `user_id` y RLS activo: cada usuario
solo ve lo suyo.

Detalle campo por campo: `docs/DATA_DICTIONARY.md`.

---

## Scripts de apoyo

| Script | Para qué |
|--------|----------|
| `../scripts/limpiar-e2e.sql` | Borra los datos que crean los tests E2E, para partir de cero |
| `../scripts/respaldo-usuario-gecheverria.sql` | Respaldo del usuario owner's |

---

## Al agregar una migración nueva

1. Nombre: `0NN_descripcion_corta.sql` (tres dígitos).
2. Encabezado en español con `Release: vX.Y.Z (pendiente)`, `Fecha` y `Descripción`.
3. **Solo** `IF NOT EXISTS` / `IF EXISTS`. La app ya está desplegada en UAT y
   producción; una migración que falle a mitad de camino deja la base rota.
4. Si la migración elimina datos, documenta en el encabezado **cómo recuperarlos**.
5. Actualiza la tabla de estado de este README y el esquema de arriba.
6. Si cambia el modelo de datos, actualiza también `docs/DATA_DICTIONARY.md`.