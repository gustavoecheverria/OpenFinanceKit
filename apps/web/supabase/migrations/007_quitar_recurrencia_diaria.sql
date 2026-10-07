-- Quita 'Diario' de las recurrencias permitidas en pagos_programados.
--
-- Razón: con un ciclo de 1 día, la ventana de alerta de 5 días no cabe dentro
-- del ciclo. El pago caería en alerta de forma permanente, incluso recién
-- pagado, rompiendo la regla AC-011d del SDD.
--
-- Es seguro: la tabla está vacía (es una migración recién aplicada y el módulo
-- todavía no existe en la app). Si algún día tuviera filas con 'Diario', este
-- ALTER fallaría, que es el comportamiento correcto: no se debe borrar data.

ALTER TABLE pagos_programados
  DROP CONSTRAINT IF EXISTS pagos_programados_recurrencia_check;

ALTER TABLE pagos_programados
  ADD CONSTRAINT pagos_programados_recurrencia_check
  CHECK (recurrencia IN ('Mensual', 'Quincenal', 'Semanal'));

-- Verificación: debe quedar exactamente este conjunto de valores permitidos.
SELECT
  c.conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS definicion
FROM pg_constraint c
WHERE c.conrelid = 'pagos_programados'::regclass
  AND c.contype = 'c'
  AND c.conname LIKE '%recurrencia%';
