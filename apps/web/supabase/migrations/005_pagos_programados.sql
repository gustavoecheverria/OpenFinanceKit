-- OpenFinanceKit — Migración 005
-- Versión: 0.4.0
-- Fecha: 2026-10-06
-- Descripción: Crea la tabla pagos_programados para plantillas de pagos recurrentes.
--              SDD: .kiro/specs/feature-pagos-programados.md
--
-- CONTEXTO:
-- El módulo de pagos actual usa la tabla `pagos`, que representa un compromiso
-- de UNA VEZ. Al marcarlo pagado solo se cambia el estado: no se crea nada en
-- `gastos` ni en `ingresos`, y al cambiar de mes el pago desaparece de la lista.
--
-- `pagos_programados` representa algo distinto: una PLANTILLA permanente que
-- se renueva sola. El usuario la registra una vez (arriendo, sueldo, cuotas) y
-- cada período marca "pagado", lo que genera el registro real en gastos o
-- ingresos y renueva el vencimiento al siguiente período.
--
-- POR QUÉ UNA TABLA NUEVA Y NO REUSAR `pagos`:
-- `pagos` ya se suma en el cálculo de saldos (Motor la lee con estado 'Pagado').
-- Agregarle campos de recurrencia obligaría a filtrar en cada cálculo y a
-- recalcular el balance histórico. Son dos entidades distintas.

CREATE TABLE IF NOT EXISTS pagos_programados (
  id SERIAL PRIMARY KEY,

  -- ── Qué es ───────────────────────────────────────────────────────────
  concepto TEXT NOT NULL CHECK (char_length(concepto) BETWEEN 1 AND 255),
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),

  -- ── Cada cuánto se repite ─────────────────────────────────────────────
  -- 'Mensual'  → día de vencimiento cada mes
  -- 'Quincenal' → dos vencimientos al mes: el día configurado y ese día + 15
  -- 'Semanal'   → +7 días corridos
  --
  -- NO hay 'Diario'. Se evaluó y se descartó: con un ciclo de 1 día, la ventana
  -- de alerta de 5 días no cabe dentro del ciclo. El pago caería en alerta de
  -- forma permanente, incluso recién pagado, rompiendo la regla de que un pago
  -- recién realizado nunca genera alerta. Si más adelante hace falta, se agrega
  -- con la alerta desactivada para ciclos cortos.
  --
  -- "Quincenal" es por fechas de mes, NO por 15 días corridos. Razón: un arriendo
  -- siempre vence en una fecha fija. Con 15 días corridos el vencimiento se iría
  -- al 31, después al 15 de otro mes, y cada mes se movería.
  recurrencia TEXT NOT NULL
    CHECK (recurrencia IN ('Mensual', 'Quincenal', 'Semanal')),

  -- ── A qué lado del historial va al concretarse ────────────────────────
  tipo TEXT NOT NULL CHECK (tipo IN ('Gasto', 'Ingreso')),

  -- ── De qué cuenta sale el dinero ──────────────────────────────────────
  -- OBLIGATORIO. "Efectivo" NO es un caso especial: es una fila más de la tabla
  -- `cuentas`, con su propio saldo. Por eso no puede ser NULL.
  -- El retiro de esa plata se registra con una fila en `transferencias` (003).
  cuenta_id INTEGER NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,

  -- ── Control del ciclo ────────────────────────────────────────────────
  fecha_inicio DATE NOT NULL,

  -- Día del mes en que vence (1-31). Se guarda separado de fecha_inicio para
  -- que el cálculo del próximo vencimiento no dependa de parsear la última
  -- fecha pagada. Para el día 31 en meses cortos se usa el último día del mes.
  dia_vencimiento INTEGER NOT NULL CHECK (dia_vencimiento BETWEEN 1 AND 31),

  -- Bookkeeping
  activo BOOLEAN NOT NULL DEFAULT TRUE,

  -- Fecha del último pago realizado. NULL = nunca se pagó.
  --
  -- IMPORTANTE: el estado ("Al día" / "Pendiente" / "Alerta" / "Vencido") NO
  -- se guarda en la base de datos. Se calcula en cada render a partir de esta
  -- fecha, el dia_vencimiento y la recurrencia. Ver sección 5.5 del SDD.
  --
  -- Por qué: es lo que permite que la plantilla se renueve sola sin un job
  -- programado. No hay estado que "venza", solo fechas que ya están.
  fecha_ultimo_pago DATE,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Índices ────────────────────────────────────────────────────────────────
-- El dashboard y /pagos consultan los pagos programados activos del usuario
CREATE INDEX IF NOT EXISTS idx_pagos_programados_user
  ON pagos_programados(user_id, activo);

-- Para consultar por proximity de vencimiento (próximos a vencer, vencidos)
CREATE INDEX IF NOT EXISTS idx_pagos_programados_vencimiento
  ON pagos_programados(user_id, dia_vencimiento);

-- ── NOTAS ─────────────────────────────────────────────────────────────────
-- ON DELETE RESTRICT en cuenta_id: si se borra una cuenta que tiene pagos
-- programados, estos dejarían de tener sentido. El usuario tiene que desactivar
-- o borrar el pago programado primero (TAREA-012 del SDD).
--
-- NO se migran los pagos existentes de la tabla `pagos`. La deuda histórica de
-- pagos con cuenta_id = NULL (anteriores a la migración 002) se resuelve con el
-- feature de pagos sin asignar, no con este.
