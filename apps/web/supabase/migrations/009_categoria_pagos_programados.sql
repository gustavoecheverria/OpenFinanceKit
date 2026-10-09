-- OpenFinanceKit — Migración 009
-- Versión: 0.4.0
-- Fecha: 2026-10-08
-- Descripción: Agrega categoria_id a pagos_programados y elimina el
--              concepto de "borrar": los pagos programados se desactivan.
--
-- CONTEXTO 1 — CATEGORÍA OBLIGATORIA:
-- Al marcar un pago programado como pagado, la acción elegía sola la primera
-- categoría del tipo (la de id más bajo). Para un usuario con "Gastos Hormiga"
-- creado temprano, ESO recibía todos sus pagos recurrentes: un arriendo de
-- $1.350.000 quedaba catalogado como "Gastos Hormiga". El usuario no tenía
-- forma de干预lo.
--
-- La solución: la categoría se elige al CREAR el pago programado y se guarda.
-- Si el usuario no tiene ninguna categoría del tipo, el formulario obliga a
-- crearla primero. Ver AC-027 del SDD.
--
-- NOT NULL con ON DELETE RESTRICT: un pago programado sin categoría no tiene
-- sentido, y borrar la categoría dejaría pagos huérfanos.

ALTER TABLE pagos_programados
  ADD COLUMN IF NOT EXISTS categoria_id INTEGER
    REFERENCES categorias(id) ON DELETE RESTRICT;

-- Backfill: asignar a los pagos existentes la categoría de menor id del mismo
-- tipo. Es un punto de partida; el usuario puede corregirla desde la UI.
UPDATE pagos_programados p
SET categoria_id = sub.categoria_id
FROM (
  SELECT DISTINCT ON (user_id, tipo) id AS categoria_id, user_id, tipo
  FROM categorias
  WHERE tipo IN ('Gasto', 'Ingreso')
  ORDER BY user_id, tipo, id
) sub
WHERE p.categoria_id IS NULL
  AND sub.user_id = p.user_id
  AND sub.tipo = p.tipo;

-- Quédate NOT NULL solo si ya no hay filas huérfanas. Si quedan, el
-- responsable es corregir los datos antes de endurecer la columna.
DO $$
DECLARE huerfanos INTEGER;
BEGIN
  SELECT count(*) INTO huerfanos
  FROM pagos_programados WHERE categoria_id IS NULL;

  IF huerfanos = 0 THEN
    ALTER TABLE pagos_programados
      ALTER COLUMN categoria_id SET NOT NULL;
    RAISE NOTICE 'categoria_id quedó NOT NULL';
  ELSE
    RAISE WARNING 'Quedan % pagos programados sin categoría. NO se aplicó NOT NULL. Revisar antes de reintentar.', huerfanos;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pagos_programados_categoria
  ON pagos_programados(categoria_id);

-- ── Contexto 2: eliminar pasa a ser desactivar ────────────────────────────
-- El usuario decidió que un pago programado nunca se borra: se desactiva y
-- deja de aparecer, pero el registro se conserva para el historial.
-- Decisión del usuario, 2026-10-08.
--
-- No se agrega columna "borrado": la app ya filtra por activo = true, y una
-- columna extra que nadie lee es deuda. Eliminar la función eliminarPagoProgramado
-- alcanza para que no exista el camino de borrado.
--
-- Ver AC-028 del SDD.
