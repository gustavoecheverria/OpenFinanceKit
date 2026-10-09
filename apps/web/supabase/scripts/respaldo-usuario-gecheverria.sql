-- OpenFinanceKit — Respaldo de datos de usuario
-- Generado antes de reiniciar la base de pruebas del usuario principal.
--
-- Usuario: c7b87013-fd3b-4dd4-9c37-bd98638072b9 (gustavoad.echeverria@gmail.com)
--
-- CÓMO RESTAURAR:
--   1. Pegar este archivo en Supabase Dashboard → SQL Editor y ejecutar.
--   2. Listo. No hay conflicto de ids aunque hayas creado cuentas o categorías
--      nuevas desde la app: los ids vienen de secuencias de PostgreSQL
--      (SERIAL), que nunca se reutilizan después de un borrado.
--      Los ids fijos de este archivo (13, 26, etc.) son los originales del
--      usuario, y las referencias (cuenta_id, categoria_id) apuntan a ellos.
--
-- El RLS no se desactiva para este usuario: el borrado se hizo desde la app
-- con la sesión del usuario, que respeta las políticas.

-- ── Cuentas ───────────────────────────────────────────────────────────────
INSERT INTO cuentas (id, nombre, saldo_inicial, user_id) VALUES
  (13, 'Tavo Bancolombia', 0, 'c7b87013-fd3b-4dd4-9c37-bd98638072b9');

-- ── Categorías ────────────────────────────────────────────────────────────
INSERT INTO categorias (id, nombre, tipo, user_id) VALUES
  (26, 'Gastos Hormiga', 'Gasto', 'c7b87013-fd3b-4dd4-9c37-bd98638072b9');

-- ── Pagos programados ─────────────────────────────────────────────────────
-- Todos desactivados (activo = false) y con la categoría 26 asignada por el
-- backfill de la migración 009. Los pagos uniqueness de la categoría 26
-- quedaron así cuando la categoría era la única de tipo Gasto; hoy se elige
-- explícitamente en el formulario.
INSERT INTO pagos_programados
  (id, concepto, valor, recurrencia, tipo, cuenta_id, categoria_id,
   fecha_inicio, dia_vencimiento, activo, fecha_ultimo_pago, user_id)
VALUES
  (57, 'CARRO', 688000, 'Mensual', 'Gasto', 13, 26,
   '2026-11-05', 5, false, '2026-10-08', 'c7b87013-fd3b-4dd4-9c37-bd98638072b9'),
  (96, 'Arriendo', 1350000, 'Mensual', 'Gasto', 13, 26,
   '2026-10-05', 5, false, '2026-10-08', 'c7b87013-fd3b-4dd4-9c37-bd98638072b9'),
  (97, 'Davivienda Tavo', 1, 'Mensual', 'Gasto', 13, 26,
   '2026-10-05', 5, false, NULL, 'c7b87013-fd3b-4dd4-9c37-bd98638072b9'),
  (98, 'Davivienda Helen', 1, 'Mensual', 'Gasto', 13, 26,
   '2026-10-05', 5, false, NULL, 'c7b87013-fd3b-4dd4-9c37-bd98638072b9');
