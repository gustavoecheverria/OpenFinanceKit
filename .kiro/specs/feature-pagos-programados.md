# OpenFinanceKit

**Documento:** Software Design Document (SDD) — Pagos Programados

**Versión:** 0.1.0

**Estado:** Draft

**Sprint:** Sprint 4 (Pagos Programados)

**Rama:** feature/pagos-programados

**Issue:** —

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-10-06

---

## 1. Resumen

Permite registrar pagos recurrentes (arriendo, salary, cuotas) como plantillas permanentes
que se renuevan solas al vencer. El usuario sabe qué tiene pendiente y para cuándo, y al marcar
un pago como realizado se genera automáticamente el registro real en `gastos` o `ingresos`.

---

## 2. Contexto y motivación

Hoy el módulo de pagos funciona como una lista de compromisos sueltos:

- El usuario agrega un pago con `fecha_vencimiento`
- Cuando lo marca como "Pagado" solo cambia el `estado`, **no se crea ningún registro** en
  `gastos` ni en `ingresos`
- Al llegar al mes siguiente el pago desaparece de la lista (la consulta ordena por
  `fecha_vencimiento` con `limit(50)` y el filtro es del mes, según `calcularMotor`)
- El usuario tiene que volver a escribir el arriendo, el sueldo, las cuotas, cada mes

**Problema real:** los gastos recurrentes se re-ingresan a mano todos los meses. Es el caso de uso
más común de una app de finanzas personales y el que más tiempo consume.

**Lo que pide el usuario, textualmente:**

- Poder saber qué pagos tiene pendientes y para qué fecha
- Registrar un pago una sola vez y que se repita solo
- Poder asignarlo a una cuenta específica (incluida "Efectivo", que es una cuenta más)
- Al marcarlo como realizado, que vaya al historial de ingresos o egresos
- Que el estado vuelva a "Pendiente" cuando se acerque la fecha, para poder generar
  notificaciones de pagos por vencer

**Si no se implementa:** el usuario mantiene el flujo manual actual, que es correcto pero
ineficiente, y el módulo de pagos no sirve para su propósito real.

---

## 3. Objetivos

- [x] OBJ-001: Crear la tabla `pagos_programados` para plantillas recurrentes
- [x] OBJ-002: Registrar un pago programado con concepto, valor, recurrencia, cuenta y tipo
      (Gasto o Ingreso)
- [x] OBJ-003: Calcular la próxima fecha de vencimiento según la recurrencia
- [x] OBJ-004: Generar automáticamente la ocurrencia pendiente cuando un pago vence
- [x] OBJ-005: Marcar un pago programado como "Pagado" crea el registro real en
      `gastos` o `ingresos` según su tipo
- [x] OBJ-006: Al marcarlo pagado, renovar la fecha al próximo período y volver a "Pendiente"
- [x] OBJ-007: Mostrar en el dashboard los pagos que vencen en los próximos 5 días
- [x] OBJ-008: Mantener la vista actual de `/pagos` funcionando (pagos únicos)
- [x] OBJ-009: Permitir desactivar un pago programado sin borrarlo
- [x] OBJ-010: Permitir transferir saldo entre cuentas, para que "Efectivo" sea una cuenta real
      con saldo propio y no un caso especial

---

## 4. Fuera de alcance

- No incluye: Notificaciones push o emails (la base de datos queda lista, OBJ-007 habilita la
  consulta; las notificaciones son una feature aparte)
- No incluye: Datos compartidos entre varios usuarios (ver sección 9, es una decisión de diseño
  para una versión futura)
- No incluye: Pagos en cuotas o con interés
- No incluye: Importación masiva desde Excel
- No incluye: Editar el historial ya generado (los registros en `gastos`/`ingresos` se editan
  desde sus propios módulos)
- No incluye: Migrar los pagos existentes de la tabla `pagos` a `pagos_programados`

---

## 5. Diseño técnico

### 5.1 Modelo de datos

El problema central: la tabla `pagos` actual mezcla dos conceptos que no son lo mismo.

| Concepto | Qué es | Dónde vive |
|----------|--------|------------|
| Compromiso de una vez | "Rentar elxies, vence el 15 de marzo" | Tabla `pagos` (existente) |
| Plantilla recurrente | "Arriendo de $500.000 todos los meses" | Tabla `pagos_programados` (nueva) |

Se crea una tabla nueva. `pagos` se conserva para no romper los pagos ya registrados y el
cálculo de saldos actual.

```sql
CREATE TABLE IF NOT EXISTS pagos_programados (
  id SERIAL PRIMARY KEY,

  -- Qué es
  concepto TEXT NOT NULL CHECK (char_length(concepto) BETWEEN 1 AND 255),
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),

  -- Cada cuánto se repite
  -- 'Mensual' | 'Quincenal' | 'Semanal'
  -- NO hay 'Diario': con ciclo de 1 día la alerta de 5 días no cabe (ver 5.5)
  recurrencia TEXT NOT NULL
    CHECK (recurrencia IN ('Mensual', 'Quincenal', 'Semanal')),

  -- A qué lado del historial va al concretarse
  tipo TEXT NOT NULL CHECK (tipo IN ('Gasto', 'Ingreso')),

  -- De qué cuenta sale el dinero. OBLIGATORIO.
  -- "Efectivo" NO es un caso especial: es una fila más en la tabla `cuentas`,
  -- con su propio saldo. Por eso el campo no puede ser NULL.
  -- RN-005: las cuentas son la única fuente de datos maestros
  cuenta_id INTEGER NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,

  -- Control del ciclo
  fecha_inicio DATE NOT NULL,
  dia_vencimiento INTEGER NOT NULL CHECK (dia_vencimiento BETWEEN 1 AND 31),

  -- Bookkeeping
  activo BOOLEAN NOT NULL DEFAULT TRUE,

  -- Fecha del último pago realizado. NULL = nunca se pagó.
  -- Es la base del cálculo del estado "Al día" (ver 5.5): el período de gracia
  -- se mide desde acá, no desde el vencimiento.
  fecha_ultimo_pago DATE,

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pagos_programados_user
  ON pagos_programados(user_id, activo);

CREATE INDEX idx_pagos_programados_vencimiento
  ON pagos_programados(user_id, dia_vencimiento);
```

**Decisión: `cuenta_id` es obligatorio. "Efectivo" es una cuenta, no una excepción.**

Este es el punto de diseño más importante del módulo, así que vale la pena explicarlo.

El caso real: el usuario retira $500.000 de la Cuenta 1 y los guarda en efectivo. Si "Efectivo"
fuera un `NULL` (es decir, "no viene de ninguna cuenta"), esos $500.000 no existirían en ningún
lado del modelo. Cuando gasta $50.000 de ese efectivo no habría ninguna cuenta a la que asociar
el gasto, y el saldo quedaría descuadrado: la Cuenta 1 ya bajó $500.000 y nadie los tiene.

La solución es que **"Efectivo" sea una fila en la tabla `cuentas`**, con nombre "Efectivo" y su
propio saldo. El usuario ya tiene esto medio hecho hoy: el seed de
`src/app/(app)/config/actions.ts:230` crea una cuenta llamada "Efectivo". Lo que falta es el
mecanismo para mover saldo entre cuentas.

Para eso, tabla nueva `transferencias`. **No altera el saldo global**: mueve $500.000 de la
Cuenta 1 a la cuenta Efectivo, el total se mantiene. Solo redistribuye entre cuentas.

```sql
CREATE TABLE IF NOT EXISTS transferencias (
  id SERIAL PRIMARY KEY,
  origen_id INTEGER NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,
  destino_id INTEGER NOT NULL REFERENCES cuentas(id) ON DELETE RESTRICT,
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  fecha DATE NOT NULL,
  concepto TEXT CHECK (char_length(concepto) <= 255),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Una transferencia no puede ser un bucle: no se puede transferir a la misma cuenta
  CHECK (origen_id <> destino_id)
);

CREATE INDEX idx_transferencias_user ON transferencias(user_id, fecha);
CREATE INDEX idx_transferencias_origen ON transferencias(user_id, origen_id);
CREATE INDEX idx_transferencias_destino ON transferencias(user_id, destino_id);
```

**Cómo entra una transferencia en los saldos.** El Motor calcula el saldo de cada cuenta como
`saldo_inicial + ingresos - gastos - pagos + Transfers_DESDE - Transfers_HACIA`. La suma de los
saldos por cuenta sigue dando el saldo global, porque una transferencia se suma y se resta en la
misma operación.

> **Impacto en `calcularSaldosPorCuenta`:** esa función debe pasar a restar las transferencias
> donde la cuenta es origen y sumar donde es destino. Es el cambio de mayor riesgo de esta feature
> porque toca el cálculo de saldos. Por eso va primero en el plan de tareas, con tests.

**Consecuencia en `pagos`:** la tabla `pagos` mantiene su `cuenta_id` nullable por compatibilidade
con los registros anteriores a la migración 002 (ver `.kiro/specs/feature-pagos-sin-asignar.md`).
Esa deuda histórica no se toca acá. Los pagos programados, que son nuevos, sí exigen cuenta.

> Nota sobre el `dia_vencimiento`: se guarda el día del mes (1-31) separado de `fecha_inicio`
> para que el cálculo de la próxima fecha no dependa de parsear la última fecha generada.
> Para el día 31 en meses cortos se usa el último día del mes (31 en enero, 28 o 29 en febrero).

**Sobre `dia_vencimiento` con recurrencia Quincenal:** la user's definición de "cada 15 días"
se implementa como dos vencimientos por mes (día 1 y 16) a partir de `fecha_inicio`, en lugar de
contar 15 días corridos. Razón: un pago de arriendo es siempre en una fecha de mes fija, y contar
15 días corridos haría que el vencimiento se vaya desplazando al día 31, luego al 15 de otro
mes, etc. Si se quiere 15 días corridos reales, es una recurrencia distinta y se agrega después.

### 5.2 Migraciones

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `supabase/migrations/003_transferencias.sql` | Crear | Tabla `transferencias` + índices |
| `supabase/migrations/004_rls_transferencias.sql` | Crear | RLS: 4 policies |
| `supabase/migrations/005_pagos_programados.sql` | Crear | Tabla `pagos_programados` + índices |
| `supabase/migrations/006_rls_pagos_programados.sql` | Crear | RLS: 4 policies |
| `supabase/migrations/007_quitar_recurrencia_diaria.sql` | Crear | Quita `Diario` del CHECK de `recurrencia` |

> La numeración arranca en 003 porque `002_pagos_cuenta.sql` ya existe en el repositorio.

Las políticas RLS siguen el patrón de `pagos`:

```sql
ALTER TABLE transferencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transferencias"
  ON transferencias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transferencias"
  ON transferencias FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transferencias"
  ON transferencias FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transferencias"
  ON transferencias FOR DELETE USING (auth.uid() = user_id);
```

### 5.3 Funciones nuevas en el Motor

RN-002: toda la lógica de fechas y cálculos vive en `src/lib/motor/`.

| Archivo | Acción | Función |
|---------|--------|---------|
| `src/lib/motor/fechas.ts` | Crear | `calcularProximaVencimiento()` — lógica pura |
| `src/lib/motor/fechas.test.ts` | Crear | Tests de la lógica de fechas |
| `src/lib/motor/index.ts` | Modificar | `obtenerPagosProgramados()`, `generarOcurrenciaPendiente()`, `obtenerVencimientosProximos()` |

#### `calcularProximaVencimiento` (lógica pura, sin I/O)

```typescript
export type Recurrencia = "Mensual" | "Quincenal" | "Semanal";

/**
 * Calcula el próximo vencimiento de un pago programado.
 *
 * REGLA: si la fecha ya pasó, avanza hasta que sea futura.
 * Esto es lo que hace que el ciclo se renueve solo sin intervención del usuario.
 */
export function calcularProximaVencimiento(
  desde: Date,
  recurrencia: Recurrencia,
  diaVencimiento: number
): Date
```

Reglas:
- `Mensual`: mismo `diaVencimiento`, mes siguiente. Si `diaVencimiento` no existe en el mes
  destino (31 en febrero), se usa el último día del mes destino.
- `Quincenal`: alterna entre `diaVencimiento` y `diaVencimiento + 15`, ajustando al mes.
- `Semanal`: +7 días corridos.
- Si el resultado es menor o igual a `desde`, se repite el cálculo hasta que sea futuro.

> Nota sobre "mes siguiente": si el día de vencimiento de ESTE mes todavía no pasó, el próximo
> vencimiento es en este mes. Ej: hoy es el 6 y el día de vencimiento es 15, el próximo vencimiento
> es el 15 de este mes. Solo se salta al mes siguiente cuando el día ya pasó. Así el pago aparece a
> tiempo para que el usuario lo vea venir.

### 5.4 Generar la ocurrencia pendiente

Cada pago programado tiene exactamente una ocurrencia pendiente visible. Cuando se marca pagado,
se crea el registro real y se recalcula la siguiente fecha.

```
pagos_programados (plantilla, siempre existe)
        │
        │  fecha_inicio + recurrencia
        ↓
ocurrencia pendiente  →  visible en /pagos  →  countdown "vence en N días"
        │
        │  usuario marca "Pagado"
        ↓
INSERT en gastos  (si tipo = Gasto)      +  UPDATE fecha → próximo vencimiento
INSERT en ingresos (si tipo = Ingreso)   +  estado → Pendiente
```

El countdown se calcula siempre contra `fecha_vencimiento`, que se deriva de la fecha actual y el
`dia_vencimiento` del template. Así el ciclo es continuo sin filas extra.

### 5.5 Estados y alertas

Un pago programado pasa por cuatro estados. El estado depende de la recurrencia, porque el período
de gracia después de pagar cambia según cada cuánto se repite.

| Estado | Cuándo | Visual |
|--------|--------|--------|
| **Al día** | Recién pagado, dentro del período de gracia | verde + "al día" |
| **Pendiente** | Fuera del período de gracia, falta más de 5 días | neutro + "vence en N días" |
| **Alerta** | Faltan 5 días o menos | amarillo + "vence en N días" |
| **Vencido** | Pasó la fecha y no se marcó | rojo + "venció hace N días" |

#### Período de gracia por recurrencia

El período de gracia es la ventana después de marcar pagado durante la cual el pago se considera
**Al día** y no genera alerta. No es un detalle cosmético: mientras el pago está Al día, el
usuario no debería estar recibiendo avisos sobre un cobro que acaba de hacer.

| Recurrencia | Días Al día | Razón |
|-------------|-------------|-------|
| Mensual | 15 | Al pago del día 5 le quedan 25 días para el siguiente. El primer aviso útil es a mitad de camino, no a los 3 días. |
| Quincenal | 7 | El ciclo es corto. 7 días es la mitad de los 15 del ciclo, en proporción. |
| Semanal | 3 | ~40% del ciclo de 7 días |

**No existe la recurrencia Diario.** Se evaluó y se descartó. Con un ciclo de 1 día, la ventana de
alerta de 5 días no cabe dentro del ciclo: el pago caería en alerta de forma permanente, incluso
recién pagado, rompiendo la regla de AC-011d. Si más adelante se necesita, se agrega con la alerta
desactivada para ciclos cortos, no con un período de gracia artificial.

**El período de gracia se calcula desde la fecha del último pago, no desde la fecha de vencimiento.**
Esto es lo que pediste: el pago se mantiene Al día los días indicados después de pagarlo, y recién
ahí empieza a contar hacia el próximo.

**Nunca hay dos alertas seguidas** por construcción: la ventana de alerta (5 días) siempre empieza
después de que termina el período de gracia, porque ambos se miden contra la fecha del pago y el
siguiente vencimiento está a un ciclo completo de distancia.

```
── dia del pago ────── fin de gracia ──── ventana de 5 días ──── vencimiento
   [     Al día       ][    Pendiente      ][      Alerta        ][ Vencido ]
   |<- 15 días ->|<---- resto del ciclo ---->|<-- 5 días -->|
```

> Nota: el umbral de 5 días de la ventana de alerta es un valor inicial. Con recurrencia Diaria
> el período de gracia es 0 y la ventana de alerta queda casi sobre el día del vencimiento. Si
> Diaria resulta incómoda en la práctica, conviene revisar el umbral.

Este umbral de 5 días es el que habilita las notificaciones futuras (OBJ-007). La función
`obtenerVencimientosProximos(dias = 5)` devuelve los que entran en la ventana de alerta.

**Vencidos:** a diferencia de `pagos`, un pago programado vencido **no se elimina**. Sigue visible
en rojo hasta que el usuario lo marque pagado o lo edite. Ese es el cambio de comportamiento que
el usuario pidió.

#### Función de cálculo en el Motor

RN-002: el estado se calcula en `src/lib/motor/fechas.ts`, nunca en el componente. Es lógica pura
y por lo tanto testeable sin base de datos.

```typescript
export type EstadoProgramado = "Al día" | "Pendiente" | "Alerta" | "Vencido";

/** Días Al día según la recurrencia. Ver tabla 5.5. */
export function diasAlDia(recurrencia: Recurrencia): number;

/**
 * Determina el estado del pago programado.
 * Mide desde la fecha del último pago, no desde el vencimiento.
 */
export function calcularEstadoProgramado(args: {
  fechaUltimoPago: Date | null;
  fechaVencimiento: Date;
  recurrencia: Recurrencia;
  hoy: Date;
}): EstadoProgramado;
```

Casos borde que debe cubrir el test:
- Pago recién realizado: devuelve `"Al día"` sin importar la recurrencia
- Transcurridos los días de gracia exactos: pasa a `"Pendiente"`
- A 5 días del vencimiento: pasa a `"Alerta"`
- Vencimiento pasado sin marcar: `"Vencido"`
- **Nunca pagado** (`fechaUltimoPago = null`): arranca en `"Pendiente"` o `"Alerta"` según la
  distancia al primer vencimiento. No hay gracia porque nunca se pagó nada.

### 5.6 Archivos afectados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `supabase/migrations/003_transferencias.sql` | Crear | Tabla + índices |
| `supabase/migrations/004_rls_transferencias.sql` | Crear | RLS |
| `supabase/migrations/005_pagos_programados.sql` | Crear | Tabla + índices |
| `supabase/migrations/006_rls_pagos_programados.sql` | Crear | RLS |
| `supabase/migrations/007_quitar_recurrencia_diaria.sql` | Crear | Quita `Diario` del CHECK |
| `src/lib/motor/fechas.ts` | Crear | Cálculo de próxima vencimiento y countdown |
| `src/lib/motor/fechas.test.ts` | Crear | Tests de fechas (bordes: fin de mes, febrero) |
| `src/lib/motor/calculations.ts` | Modificar | `calcularSaldosPorCuenta` incorpora transferencias |
| `src/lib/motor/calculations.test.ts` | Modificar | Tests del saldo con transferencias |
| `src/lib/motor/index.ts` | Modificar | Consultas de pagos programados y transferencias |
| `src/app/(app)/pagos/page.tsx` | Modificar | Mostrar programados con countdown |
| `src/app/(app)/pagos/nuevo/page.tsx` | Modificar | Formulario con tipo y recurrencia |
| `src/app/(app)/pagos/actions.ts` | Modificar | `marcarPagado` genera el registro real |
| `src/components/pagos/pago-programado-card.tsx` | Crear | Card con countdown y botón pagar |
| `src/app/(app)/cuentas/transferir/page.tsx` | Crear | Transferir saldo entre cuentas |
| `src/app/(app)/cuentas/transferir/actions.ts` | Crear | Server action de transferencia |
| `src/app/(app)/dashboard/page.tsx` | Modificar | Indicador de próximos vencimientos |

### 5.7 Reglas de negocio aplicables

| RN | Descripción | Cómo se aplica |
|----|-------------|----------------|
| RN-001 | Configuración es la única fuente de datos maestros | `cuenta_id` es FK a `cuentas`; nunca se escribe el nombre en texto |
| RN-002 | El Motor es la única capa autorizada para cálculos | `calcularProximaVencimiento` y el countdown viven en `motor/fechas.ts` |
| RN-003 | El Dashboard solo visualiza | Solo llama a `obtenerVencimientosProximos()` |
| RN-004 | Las hojas de captura solo almacenan datos | `/pagos` guarda el estado; el registro real lo hace la server action |
| RN-005 | Las listas desplegables obtienen valores desde Configuración | Los selects de cuenta salen de la tabla `cuentas` |

**RN-006 (nueva propuesta):** marcar un pago programado como pagado es la única vía para que un
pago programado genere un registro en `gastos` o `ingresos`.

### 5.8 Server action `marcarPagoProgramadoPagado`

```typescript
export async function marcarPagoProgramadoPagado(
  _prevState: FormState,
  formData: FormData
): Promise<FormState>
```

Pasos:

1. Validar sesión y que el pago programado sea del usuario
2. Calcular `fechaPago = hoy`
3. Según `tipo`:
   - `Gasto` → `INSERT` en `gastos` con `categoria_id`, `cuenta_id`, `valor`, `fecha`, `descripcion: concepto`
   - `Ingreso` → `INSERT` en `ingresos` con los mismos campos
4. `UPDATE` en `pagos_programados`: `fecha_ultimo_pago = hoy`
5. `revalidatePath("/pagos")`, `revalidatePath("/dashboard")`, `revalidatePath("/gastos")`,
   `revalidatePath("/ingresos")`

**No se guarda estado.** La fila de `pagos_programados` no tiene columna de estado: el estado se
calcula en cada render a partir de `fecha_ultimo_pago`, `dia_vencimiento` y la recurrencia. Esa
es la razón por la que el pago se renueva solo sin necesidad de un job programado: no hay nada que
actualizar, solo fechas que ya están.

Validaciones:
- `valor > 0`
- La fecha se valida con el mismo `esFechaValida` que ya existe en `actions.ts` (G4)
- El `concepto` se trimea y se limita a 255 chars (G1, G2) — misma política que el resto del módulo

**Duplicados:** si el usuario hace doble click o refresca, se puede insertar dos veces. Mitigación:
rechazar la action si `fecha_ultimo_pago` ya es igual a hoy. Como el estado vive calculado, esta
columna cumple además la función de marcador de la última operación.

---

## 6. Criterios de aceptación

- [x] **AC-001:** Se puede crear un pago programado con concepto, valor, recurrencia, cuenta y tipo
- [x] **AC-002:** La recurrencia ofrece Mensual, Quincenal y Semanal
- [x] **AC-003:** El tipo permite elegir Gasto o Ingreso
- [x] **AC-004:** El select de cuenta incluye "Efectivo" junto a las demás, porque Efectivo es una
      cuenta más de la lista. No hay una opción "sin cuenta"
- [x] **AC-005:** Un pago programado con vencimiento hoy aparece en `/pagos` con "vence hoy"
- [x] **AC-006:** Un pago a más de 5 días aparece sin alerta; a 5 días o menos, en amarillo
- [x] **AC-007:** Un pago que pasó su fecha y no se marcó aparece como "Vencido" en rojo, y
      **no desaparece** de la lista
- [x] **AC-008:** Marcar un pago programado como pagado crea un registro en `gastos` con el
      valor, la fecha de hoy y la cuenta asignada
- [x] **AC-009:** Si el tipo es `Ingreso`, el registro va a `ingresos`, no a `gastos`
- [x] **AC-010:** Tras marcar pagado, el saldo de la cuenta refleja el movimiento
- [x] **AC-011:** Tras marcar pagado, el pago programado queda en estado **"Al día"** y muestra el
      próximo vencimiento calculado. No vuelve directo a "Pendiente"
- [x] **AC-011a:** Un pago mensual recién pagado queda "Al día" durante 15 días
- [x] **AC-011b:** Un pago quincenal recién pagado queda "Al día" durante 7 días
- [x] **AC-011c:** Un pago semanal recién pagado queda "Al día" durante 3 días
- [x] **AC-011d:** Un pago recién pagado **nunca** muestra alerta ni aparece como vencido, aunque
      el próximo vencimiento esté cerca
- [x] **AC-011e:** Transcurrido el período de gracia, el pago pasa a "Pendiente" y recién ahí
      empieza a contar hacia el próximo vencimiento
- [x] **AC-011f:** Al entrar en la ventana de 5 días, el pago pasa a "Alerta"
- [x] **AC-012:** El dashboard muestra los pagos que vencen en los próximos 5 días con su cuenta
- [ ] **AC-013:** Un pago programado desactivado no aparece pero se conserva en la DB
      _(pendiente: requiere prueba manual)_
- [ ] **AC-014:** La lista `/pagos` no tiene límite de 50 registros para los programados
      _(verificado por código: `obtenerPagosProgramados()` no aplica `.limit()`; falta prueba con >50)_
- [x] **AC-015:** `npm run test` pasa con los casos de `calcularProximaVencimiento` incluidos
- [x] **AC-016:** `npx tsc --noEmit` sin errores
- [ ] **AC-017:** Mobile-first: el countdown y los botones se leen bien en pantalla chica
      _(pendiente: requiere prueba en viewport móvil)_
- [ ] **AC-018:** Un usuario no puede ver ni modificar pagos programados de otro usuario (RLS).
      **Vigente solo en esta versión.** Ver sección 9 para el modelo de datos compartido futuro
      _(políticas RLS verificadas en la base: 8 políticas activas. Falta test E2E con 2 usuarios)_
- [x] **AC-018a:** El estado "Al día" se calcula desde la fecha del último pago, no desde la fecha
      de vencimiento
- [x] **AC-018b:** Un pago programado nunca pagado no tiene período de gracia: arranca en
      "Pendiente" o "Alerta" según la distancia al primer vencimiento
- [x] **AC-018c:** El estado nunca se persiste en la base de datos, se calcula en cada render
- [x] **AC-019:** Un pago programado no se puede guardar sin cuenta asignada
- [x] **AC-020:** Se puede transferir saldo de una cuenta a otra, incluido desde y hacia "Efectivo"
- [x] **AC-021:** Una transferencia **no** altera el saldo global: la suma de saldos por cuenta
      es idéntica antes y después
- [x] **AC-022:** Una transferencia resta en la cuenta origen y suma en la cuenta destino
- [x] **AC-023:** No se puede transferir a la misma cuenta de origen
- [x] **AC-024:** No se puede transferir un valor mayor al saldo disponible del origen
- [x] **AC-025:** Un gasto registrado contra la cuenta "Efectivo" descuenta del saldo de Efectivo
- [x] **AC-026:** La suma de saldos por cuenta sigue cuadrando con el saldo global después de
      transferir, gastar e ingresos (test automatizado en `calculations.test.ts`)

---

## 7. Plan de tareas

- [x] TAREA-001: Crear migraciones `003_transferencias.sql` y `004_rls_transferencias.sql`
- [x] TAREA-002: Modificar `calcularSaldosPorCuenta()` para incorporar transferencias
- [x] TAREA-003: Agregar tests en `calculations.test.ts` que prueben que la suma de saldos por
      cuenta sigue cuadrando con el saldo global (AC-021, AC-026)
- [x] TAREA-004: Implementar `calcularProximaVencimiento()` en `src/lib/motor/fechas.ts`
- [x] TAREA-005: Escribir `fechas.test.ts` con los casos borde (fin de mes, febrero bisiesto,
      recurrencia vencida que debe avanzar)
- [x] TAREA-005a: Implementar `diasAlDia()` y `calcularEstadoProgramado()` en `fechas.ts`
- [x] TAREA-005b: Agregar tests de los cuatro estados, incluido el caso de pago recién realizado
      en las cuatro recurrencias y el caso nunca pagado
- [x] TAREA-005c: Migración `007` para quitar la recurrencia `Diario` del CHECK en la base
      (decisión del usuario: la alerta de 5 días no cabe en un ciclo de 1 día)
- [x] TAREA-006: Crear migraciones `005_pagos_programados.sql` y `006_rls_pagos_programados.sql`
- [x] TAREA-007: Agregar `obtenerPagosProgramados()` y `obtenerVencimientosProximos()` en
      `motor/index.ts`
- [x] TAREA-007a: Las transferencias entran en `obtenerSaldosPorCuentaData()` para que el
      cálculo de saldos por cuenta las tenga en cuenta
- [x] TAREA-008: Crear `/cuentas/transferir/` con su server action y validaciones
- [x] TAREA-009: Crear `PagoProgramadoCard` con countdown y botón "Marcar pagado"
- [x] TAREA-010: Crear `/pagos/programado/nuevo/` con el formulario de tipo, recurrencia,
      día de vencimiento y cuenta obligatoria
- [x] TAREA-011: Implementar `marcarPagoProgramadoPagado()` con el INSERT en `gastos`/`ingresos`
- [x] TAREA-012: Implementar `crearPagoProgramado()`, `togglePagoProgramadoActivo()` y
      `eliminarPagoProgramado()`
- [x] TAREA-013: Integrar los pagos programados en `/pagos/page.tsx` con el countdown
- [x] TAREA-014: Agregar el indicador de próximos vencimientos al dashboard
- [x] TAREA-015: Validar AC-001 a AC-026 con `tsc`, `npm run test` y prueba automatizada
- [x] TAREA-015a: Tests E2E en `e2e/pagos-programados.spec.ts` (10 casos: ciclo del pago,
      registro en gastos e ingresos, cuenta obligatoria, dashboard, transferencias)
- [x] TAREA-015b: Script `supabase/scripts/limpiar-e2e.sql` para limpiar datos de prueba
- [ ] TAREA-016: Proponer mensaje de commit (hook commit-message)
- [ ] TAREA-017: Esperar aprobación del usuario para merge a develop

---

## 8. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **`calcularSaldosPorCuenta` queda mal al agregar transferencias** | **Alto** | Es el mayor riesgo de la feature. Va primero (TAREA-002) con test obligatorio en TAREA-003 que falle si la suma no cuadra |
| Doble clic genera dos registros | Alto | Rechazar si `fecha_ultimo_pago = hoy`. Además disable el botón mientras corre la action |
| Transferencia con saldo insuficiente | Alto | Validar contra el saldo actual del origen antes de insertar, en la server action |
| Vencimiento el día 31 en meses cortos | Medio | `calcularProximaVencimiento` ajusta al último día del mes. Cubierto en tests |
| Migración no aplicada en Supabase | Alto | La feature no funciona sin las tablas. Verificar antes de probar |
| El usuario no tiene una cuenta "Efectivo" creada | Medio | El seed ya la crea. Si no existe, mostrar un hint en el select para crearla en Config |
| La tabla `pagos` y `pagos_programados` confunden al usuario | Medio | `/pagos` muestra ambos con etiquetas distintas. Los programados tienen icono de repetición |
| El countdown se desactualiza sin refrescar | Bajo | Se calcula en el Server Component, se recalcula en cada render |

**Dependencias:** requiere aplicar las migraciones 003, 004, 005 y 006 en el proyecto de Supabase
antes de probar. Sin eso la app no arranca.

**Orden importante:** las transferencias se implementan **antes** que los pagos programados. Sin
el modelo de transferencias, un pago en efectivo no se puede contabilizar, y esa fue la razón de
fondo para construir esta feature.

---

## 9. Dirección de producto: datos compartidos entre varias personas

Esta sección **no se implementa ahora**. Queda documentada porque el diseño de esta feature la
toca, y conviene saber que está considerada antes de escribir el código, no después.

**El requerimiento:** en una versión futura, varias personas podrían trabajar sobre el mismo
dashboard, compartiendo los datos. Por ejemplo:

```
Dashboard "Hogar"
   → Gustavo (propietario)
   → Valentina (invitada)
```

Ambos ven los mismos ingresos, gastos, cuentas y pagos programados.

**Lo que significa para el RLS actual (AC-018):** el modelo vigente aisla los datos por
`auth.uid() = user_id`. Eso se mantiene en esta versión. Pero el aislamiento por usuario y el
compartimiento por dashboard son dos estrategias distintas de RLS, y la primera no se convierte en
la segunda sin migración: cambiar de "aislar por usuario" a "aislar por dashboard" implica
reescribir las políticas y mover el `user_id` de la fuente de verdad a una tabla de pertenencia.

**Cómo queda preparado el diseño sin comprometer la versión actual:**

- El estado "Al día" ya se calcula en el Motor como lógica pura (`calcularEstadoProgramado`),
  sin tocar la base de datos. Esa lógica es la misma para un usuario o para un dashboard.
- `pagos_programados` guarda `user_id` como cualquier tabla. Cuando exista el dashboard, ese campo
  pasa a ser "dueño del recurso" y se agrega `dashboard_id` como clave de agrupación.
- El período de gracia por recurrencia no depende de quién mira el pago. Un pago compartido sigue
  teniendo los mismos 15 días de gracia.

**Lo que hay que decidir cuando llegue el momento:**

| Pregunta | Por qué importa |
|----------|-----------------|
| ¿El dashboard tiene dueño con permiso de borrar? | Define la política de `DELETE` |
| ¿Qué pasa con las invitaciones pendientes? | Alguien invitado pero nunca aceptado, ¿ve los datos? |
| ¿El `user_id` se queda como dueño o se elimina? | Afecta el RLS de todas las tablas, no solo pagos |
| ¿El saldo inicial de las cuentas es del dashboard o de la persona? | Hoy es por usuario. En compartido puede generar confusión |

**Mitigación para esta versión:** ninguna acción extra es necesaria. Las dos decisiones que sí
importan ya están tomadas y no complican el futuro: el estado vive en el Motor como lógica pura, y
la tabla tiene `user_id` con el mismo patrón que el resto del schema.

---

## 10. Notas adicionales

**Alternativa descartada:** reutilizar la tabla `pagos` agregando campos de recurrencia. Se
descartó porque `pagos` representa un compromiso de una sola vez y el Motor ya la suma para
calcular saldos. Mezclar ambos conceptos obligaría a filtrar en cada cálculo y a recalcular el
balance histórico. Son dos entidades distintas.

**Corrección de diseño:** la primera versión de este SDD proponía `cuenta_id` nullable con un
valor especial para efectivo. Eso estaba mal: sin una cuenta con saldo, el efectivo retirado no
tenía dónde existir y los gastos hechos con él quedaban sin associating. La corrección es tratar
Efectivo como una cuenta real y agregar transferencias para poder mover saldo entre cuentas.

**Qué queda para después:** notificaciones push cuando un pago entra en la ventana de 5 días.
La función `obtenerVencimientosProximos(dias)` queda como la base para eso.

**Sobre Quincenal:** definido como día 1 y 16 del mes, no como 15 días corridos. Si el usuario
necesita 15 días corridos reales, se agrega como recurrencia separada.

**Migración de la tabla `pagos`:** la deuda histórica de `pagos.cuenta_id = NULL` (pagos anteriores
a la migración 002) sigue abierta y se resuelve con el feature de pagos sin asignar. No se mezcla
con esta feature.

**Sobre "Efectivo":** no se agrega una columna `tipo` a la tabla `cuentas`. Efectivo se distingue
solo por su nombre, igual que hoy. Agregar `tipo = 'Efectivo' | 'Banco'` sería más explícito pero
obligaría a una migración de backfill sobre datos existentes sin ganancia funcional: la app no
necesita distinguir tipos de cuenta, solo balances. Si más adelante aparecen bancos, tarjetas de
crédito y otros con reglas distintas, ahí sí conviene agregar la columna.
