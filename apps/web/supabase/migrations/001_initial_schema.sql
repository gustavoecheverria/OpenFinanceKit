-- OpenFinanceKit — Initial Schema
-- Version: 0.2.0
-- Date: 2026-08-27
-- Description: Creates all tables for OFK Web MVP

-- ============================================================
-- CATEGORÍAS (datos maestros)
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Ingreso', 'Gasto')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categorias_user ON categorias(user_id);
CREATE INDEX idx_categorias_tipo ON categorias(user_id, tipo);

-- ============================================================
-- CUENTAS (datos maestros)
-- ============================================================
CREATE TABLE IF NOT EXISTS cuentas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  saldo_inicial DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (saldo_inicial >= 0),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cuentas_user ON cuentas(user_id);

-- ============================================================
-- INGRESOS
-- ============================================================
CREATE TABLE IF NOT EXISTS ingresos (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  cuenta_id INTEGER NOT NULL REFERENCES cuentas(id),
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  descripcion TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ingresos_user ON ingresos(user_id);
CREATE INDEX idx_ingresos_fecha ON ingresos(user_id, fecha);

-- ============================================================
-- GASTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS gastos (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  cuenta_id INTEGER NOT NULL REFERENCES cuentas(id),
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  descripcion TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gastos_user ON gastos(user_id);
CREATE INDEX idx_gastos_fecha ON gastos(user_id, fecha);

-- ============================================================
-- PAGOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  concepto TEXT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagado', 'Vencido')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pagos_user ON pagos(user_id);
CREATE INDEX idx_pagos_estado ON pagos(user_id, estado);
CREATE INDEX idx_pagos_vencimiento ON pagos(user_id, fecha_vencimiento);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users can view own categorias"
  ON categorias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categorias"
  ON categorias FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categorias"
  ON categorias FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categorias"
  ON categorias FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cuentas"
  ON cuentas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cuentas"
  ON cuentas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cuentas"
  ON cuentas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cuentas"
  ON cuentas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ingresos"
  ON ingresos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ingresos"
  ON ingresos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ingresos"
  ON ingresos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ingresos"
  ON ingresos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own gastos"
  ON gastos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gastos"
  ON gastos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gastos"
  ON gastos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gastos"
  ON gastos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own pagos"
  ON pagos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pagos"
  ON pagos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pagos"
  ON pagos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pagos"
  ON pagos FOR DELETE USING (auth.uid() = user_id);
