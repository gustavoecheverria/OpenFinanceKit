-- OpenFinanceKit — Migración 002
-- Release: NUNCA APLICADA — superada por la migración 008
-- Fecha de escritura: 2026-08-28
-- Descripción: Agregaba cuenta_id a la tabla `pagos` para que el Motor
--              descontara los pagos pagados del saldo de cada cuenta.
--
-- ⚠️ ESTADO: ESTA MIGRACIÓN NUNCA SE EJECUTÓ EN LA BASE REAL.
-- Ver la migración 008, que documenta el problema: el código insertaba
-- `pagos.cuenta_id` pero la columna no existía, así que el formulario de pagos
-- fallaba siempre con "No se pudo guardar el pago. Intenta de nuevo."
--
-- Después, la tabla `pagos` completa fue eliminada por la migración 008, con lo
-- que este archivo quedó sin objeto.
--
-- ESTE ARCHIVO SE CONSERVA SOLO POR TRAZABILIDAD. No lo apliques.
-- Si necesitas una base limpia, parte de 001 y sigue con 003.

-- ── Agregar columna cuenta_id (nullable para no romper registros existentes) ──
ALTER TABLE pagos
  ADD COLUMN IF NOT EXISTS cuenta_id INTEGER REFERENCES cuentas(id) ON DELETE SET NULL;

-- ── Índice para queries del Motor filtradas por cuenta ──────────────────
CREATE INDEX IF NOT EXISTS idx_pagos_cuenta ON pagos(user_id, cuenta_id);

-- ── INSTRUCCIONES DE EJECUCIÓN ──────────────────────────────────────────
-- Ejecutar en Supabase Dashboard → SQL Editor:
-- 1. Copiar y pegar este archivo completo
-- 2. Ejecutar
-- 3. Verificar que la columna "cuenta_id" aparece en la tabla "pagos"
--
-- NOTA: La columna es nullable a propósito.
-- Los pagos existentes quedan con cuenta_id = NULL y no afectan el saldo.
-- Los pagos nuevos requerirán cuenta_id desde el formulario.
