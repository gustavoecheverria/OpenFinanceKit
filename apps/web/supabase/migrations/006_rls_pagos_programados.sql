-- OpenFinanceKit — Migración 006
-- Versión: 0.4.0
-- Fecha: 2026-10-06
-- Descripción: Row Level Security para la tabla pagos_programados.
--              Sigue el mismo patrón que pagos (001) y pagos.cuenta_id (002).

-- ── Activar RLS ───────────────────────────────────────────────────────────
ALTER TABLE pagos_programados ENABLE ROW LEVEL SECURITY;

-- ── Políticas: cada usuario solo ve y toca sus propios pagos programados ──
CREATE POLICY "Users can view own pagos_programados"
  ON pagos_programados FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pagos_programados"
  ON pagos_programados FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pagos_programados"
  ON pagos_programados FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pagos_programados"
  ON pagos_programados FOR DELETE
  USING (auth.uid() = user_id);

-- ── NOTAS ─────────────────────────────────────────────────────────────────
-- Estas políticas aíslan por usuario. VIGEN SOLO EN ESTA VERSIÓN.
--
-- El producto contempla que en el futuro varias personas trabajen sobre el
-- mismo dashboard compartiendo datos. Eso es un cambio de estrategia de RLS:
-- pasar de "aislar por user_id" a "aislar por dashboard" implica reescribir las
-- políticas y mover user_id a una tabla de pertenencia. Afecta a TODAS las
-- tablas, no solo a esta.
--
-- Ver sección 9 del SDD feature-pagos-programados, donde queda documentado.
--
-- Lo que este diseño NO compromete:
-- - El estado del pago se calcula en el Motor como lógica pura, no en SQL.
--   Esa función sirve igual para un usuario o para un dashboard.
-- - user_id sigue el mismo patrón que el resto del schema, así que la migración
--   futura es mecánica y no exige rediseñar las tablas.
