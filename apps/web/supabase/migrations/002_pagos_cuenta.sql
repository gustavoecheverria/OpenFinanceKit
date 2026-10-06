-- OpenFinanceKit — Migración 002
-- Versión: 0.3.0
-- Fecha: 2026-08-28
-- Descripción: Agrega cuenta_id a la tabla pagos para que el Motor
--              pueda descontar los pagos pagados del saldo de cada cuenta.

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
