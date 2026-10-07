-- OpenFinanceKit — Migración 003
-- Versión: 0.4.0
-- Fecha: 2026-10-06
-- Descripción: Crea la tabla transferencias para mover saldo entre cuentas.
--              Hace falta porque "Efectivo" es una cuenta más de la lista
--              (la crea el seed en config/actions.ts), y para que tenga saldo
--              propio hace falta poder pasarle plata desde otra cuenta.
--
-- CONTEXTO:
-- Si el usuario retira $500.000 de la Cuenta 1 y los guarda en efectivo, esos
-- $500.000 tienen que existir como saldo en la cuenta "Efectivo". Sin esta
-- tabla no hay forma de moverlos, y los gastos hechos con ese efectivo quedarían
-- sin cuenta a la que imputarse.
--
-- UNA TRANSFERENCIA NO ALTERA EL SALDO GLOBAL:
-- Solo redistribuye entre cuentas. El Motor lo maneja restando donde la cuenta
-- es origen y sumando donde es destino, de modo que la suma de saldos por cuenta
-- sigue cuadrando con el saldo global.

-- ── Tabla transferencias ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transferencias (
  id SERIAL PRIMARY KEY,

  -- De dónde sale el dinero
  origen_id INTEGER NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,

  -- A dónde llega
  destino_id INTEGER NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,

  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  fecha DATE NOT NULL,
  concepto TEXT CHECK (char_length(concepto) <= 255),

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- No se puede transferir a la misma cuenta (sería un bucle sin efecto)
  CHECK (origen_id <> destino_id)
);

-- ── Índices para los queries del Motor ───────────────────────────────────
-- El Motor consulta transferencias por usuario y por cuenta (como origen o destino)
CREATE INDEX IF NOT EXISTS idx_transferencias_user
  ON transferencias(user_id, fecha);
CREATE INDEX IF NOT EXISTS idx_transferencias_origen
  ON transferencias(user_id, origen_id);
CREATE INDEX IF NOT EXISTS idx_transferencias_destino
  ON transferencias(user_id, destino_id);

-- ── NOTAS ─────────────────────────────────────────────────────────────────
-- ON DELETE RESTRICT en origen_id y destino_id: no se puede borrar una cuenta
-- que tenga transferencias registradas. Es intencional: el historial debe quedar
-- consistente. Si el usuario quiere deshacerse de una cuenta, primero tiene que
-- eliminar las transferencias.
--
-- La validación de saldo insuficiente NO está en la base de datos porque requiere
-- leer el saldo actual de la cuenta (que es un cálculo, no un dato de esta fila).
-- Se valida en la server action antes de insertar.
