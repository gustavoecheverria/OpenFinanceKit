-- OpenFinanceKit — Migración 004
-- Versión: 0.4.0
-- Fecha: 2026-10-06
-- Descripción: Row Level Security para la tabla transferencias.
--              Sigue el mismo patrón que la tabla pagos (001) y pagos.cuenta_id (002).

-- ── Activar RLS ───────────────────────────────────────────────────────────
ALTER TABLE transferencias ENABLE ROW LEVEL SECURITY;

-- ── Políticas: cada usuario solo ve y toca sus propias transferencias ──────
CREATE POLICY "Users can view own transferencias"
  ON transferencias FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transferencias"
  ON transferencias FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transferencias"
  ON transferencias FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transferencias"
  ON transferencias FOR DELETE
  USING (auth.uid() = user_id);

-- ── NOTAS ─────────────────────────────────────────────────────────────────
-- IMPORTANTE: las políticas validan user_id, pero NO validan que origen_id y
-- destino_id pertenezcan al usuario. Eso se valida en la server action
-- (TAREA-008 del SDD feature-pagos-programados).
--
-- La razón de no meterlo en RLS es que una policy de INSERT con subconsulta
-- sobre 'cuentas' es correcta pero más difícil de leer y depurar. La validación
-- en la action es explícita y ya existe el patrón en actions.ts de gastos.
