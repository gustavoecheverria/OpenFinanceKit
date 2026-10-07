-- Limpieza de datos de prueba E2E (OpenFinanceKit)
--
-- Uso: npx supabase db query --linked --file "supabase\scripts\limpiar-e2e.sql"
--
-- POR QUÉ EXISTE:
-- Los tests E2E crean cuentas y categorías con sufijo de corrida (-NNNNNN) y
-- no tienen teardown, así que se acumulan. Con ~50 cuentas, /config tarda
-- demasiado en renderizar y los tests se caen por timeout, con resultados que
-- alternan entre corridas.
--
-- QUÉ BORRA:
-- - Pagos programados y transferencias de cualquier corrida (tablas nuevas,
--   solo las usan los tests E2E por ahora).
--
-- QUÉ NO BORRA:
-- - Cuentas y categorías: tienen FK desde gastos e ingresos, y borrarlas
--   rompería los tests de config-crud. Si se quieren limpiar, hay que borrar
--   antes los movimientos huérfanos:
--
--   DELETE FROM gastos WHERE descripcion LIKE '%-%' AND descripcion ~ '\d{6}$';
--   DELETE FROM ingresos WHERE descripcion LIKE '%-%' AND descripcion ~ '\d{6}$';
--   DELETE FROM categorias c WHERE c.nombre ~ '\d{6}$'
--     AND NOT EXISTS (SELECT 1 FROM gastos g WHERE g.categoria_id = c.id);
--   DELETE FROM cuentas c WHERE c.nombre ~ '\d{6}$'
--     AND NOT EXISTS (SELECT 1 FROM gastos g WHERE g.cuenta_id = c.id);

DELETE FROM pagos_programados;
DELETE FROM transferencias;

-- Reporte
SELECT
  (SELECT count(*) FROM categorias)   AS categorias,
  (SELECT count(*) FROM cuentas)      AS cuentas,
  (SELECT count(*) FROM gastos)       AS gastos,
  (SELECT count(*) FROM ingresos)     AS ingresos,
  (SELECT count(*) FROM pagos)        AS pagos,
  (SELECT count(*) FROM pagos_programados) AS pagos_programados,
  (SELECT count(*) FROM transferencias)     AS transferencias;
