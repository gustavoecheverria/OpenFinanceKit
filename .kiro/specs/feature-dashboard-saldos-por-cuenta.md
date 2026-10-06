# OpenFinanceKit

**Documento:** Software Design Document (SDD) — Dashboard: Saldos por Cuenta

**Versión:** 0.1.0

**Estado:** ✅ Completado — Mergeado a develop (UAT) 2026-10-05 19:00

**Sprint:** Sprint 2

**Rama:** feature/dashboard-saldos-por-cuenta (histórica)

**Issue:** —

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-10-05 (confirmado en UAT)

---

## 1. Resumen

Agregar una sección de "Saldos por Cuenta" en el Dashboard que muestre el saldo actual de cada cuenta registrada por el usuario, calculado como `saldo_inicial + ingresos históricos - gastos históricos - pagos pagados` filtrado por `cuenta_id`. Así el usuario sabe exactamente de dónde vienen los números globales y en qué estado está cada cuenta.

---

## 2. Contexto y motivación

El dashboard actual muestra 6 indicadores globales (saldo total, ingresos del mes, gastos del mes, pendiente, disponible, % gastado). El problema: el usuario no puede ver **de dónde viene** ese dinero. Si tiene 3 cuentas (p.ej. cuenta corriente, ahorros, efectivo), no sabe cuánto hay en cada una.

Hoy el Motor suma todos los `saldo_inicial` de todas las cuentas para calcular el saldo global. La fórmula por cuenta existe implícitamente (ingresos y gastos tienen `cuenta_id` como FK obligatorio; pagos tienen `cuenta_id` nullable desde la migración 002), pero nadie la expone visualmente.

Sin esta feature, el usuario tiene que ir a Configuración para ver los saldos iniciales, sin poder ver el efecto de las transacciones por cuenta.

---

## 3. Objetivos

- [ ] Extender el Motor con una nueva función `calcularSaldosPorCuenta()` que devuelva el saldo actual de cada cuenta
- [ ] Mostrar en el Dashboard una sección "Tus cuentas" debajo de los 6 indicadores globales
- [ ] Cada cuenta se muestra con: nombre, saldo actual y un indicador visual de si está positiva, baja o crítica
- [ ] La sección respeta el estilo visual existente (Tailwind CSS, CSS variables, mobile-first)
- [ ] Si no hay cuentas registradas, mostrar un mensaje de guía al usuario

---

## 4. Fuera de alcance

- No incluye: historial de movimientos por cuenta (lista de transacciones por cuenta)
- No incluye: gráficos de barras o pasteles por cuenta
- No incluye: filtrado del dashboard por cuenta específica
- No incluye: nuevo campo `tipo` en cuentas (cuenta corriente, ahorros, etc.)
- No incluye: ordenamiento configurable de las cuentas por el usuario
- No incluye: desglose de pagos pendientes por cuenta

---

## 5. Diseño técnico

### 5.1 Archivos afectados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/lib/motor/types.ts` | Modificar | Agregar tipo `SaldoCuenta` y `SaldosPorCuentaResult` |
| `src/lib/motor/calculations.ts` | Modificar | Agregar función pura `calcularSaldosPorCuenta()` |
| `src/lib/motor/index.ts` | Modificar | Agregar función I/O `obtenerSaldosPorCuenta()` y exportarla |
| `src/lib/motor/calculations.test.ts` | Modificar | Agregar tests para `calcularSaldosPorCuenta()` |
| `src/components/dashboard/account-balance-list.tsx` | Crear | Componente que renderiza la lista de saldos por cuenta |
| `src/app/(app)/dashboard/page.tsx` | Modificar | Llamar a `obtenerSaldosPorCuenta()` y renderizar `AccountBalanceList` |

### 5.2 Cambios en el modelo de datos

No se requieren migraciones. El modelo ya tiene todo lo necesario:
- `cuentas`: `id`, `nombre`, `saldo_inicial`
- `ingresos`: `cuenta_id` (NOT NULL FK)
- `gastos`: `cuenta_id` (NOT NULL FK)
- `pagos`: `cuenta_id` (nullable desde migración 002)

La fórmula por cuenta es:
```
saldo_cuenta = saldo_inicial
             + SUM(ingresos WHERE cuenta_id = X)
             - SUM(gastos WHERE cuenta_id = X)
             - SUM(pagos WHERE cuenta_id = X AND estado = 'Pagado' AND cuenta_id IS NOT NULL)
```

### 5.3 Reglas de negocio aplicables

| RN | Descripción |
|----|-------------|
| RN-002 | Toda la lógica de cálculo vive en el Motor (`calculations.ts`) |
| RN-003 | El Dashboard solo visualiza — no calcula ni almacena |
| RN-004 | Los componentes de captura (formularios) no participan en este cambio |

### 5.4 Nuevos tipos en `types.ts`

```typescript
/** Saldo calculado de una cuenta individual. */
export interface SaldoCuenta {
  id: number;
  nombre: string;
  saldoInicial: number;
  totalIngresos: number;
  totalGastos: number;
  totalPagosPagados: number;
  saldoActual: number;
}

/** Resultado de la función calcularSaldosPorCuenta. */
export interface SaldosPorCuentaResult {
  cuentas: SaldoCuenta[];
}
```

### 5.5 Nueva función pura en `calculations.ts`

```typescript
/**
 * Calcula el saldo actual de cada cuenta individualmente.
 * Función pura — sin I/O.
 * RN-002: La lógica vive en el Motor.
 */
export function calcularSaldosPorCuenta(
  datosPorCuenta: DatosPorCuenta[]
): SaldosPorCuentaResult {
  const cuentas = datosPorCuenta.map((d) => {
    const totalIngresos = sumar(d.ingresos);
    const totalGastos = sumar(d.gastos);
    const totalPagosPagados = sumar(d.pagosPagados);
    const saldoActual = d.saldoInicial + totalIngresos - totalGastos - totalPagosPagados;
    return {
      id: d.id,
      nombre: d.nombre,
      saldoInicial: d.saldoInicial,
      totalIngresos,
      totalGastos,
      totalPagosPagados,
      saldoActual,
    };
  });
  return { cuentas };
}
```

### 5.6 Nuevo tipo de entrada `DatosPorCuenta`

```typescript
/** Datos crudos de una cuenta para calcular su saldo. */
export interface DatosPorCuenta {
  id: number;
  nombre: string;
  saldoInicial: number;
  ingresos: number[];
  gastos: number[];
  pagosPagados: number[];
}
```

### 5.7 Nueva función I/O en `index.ts`

```typescript
/**
 * Obtiene los saldos actuales de todas las cuentas del usuario.
 * Hace 3 queries paralelas por cada cuenta (ingresos, gastos, pagos pagados).
 * Optimización: una query con GROUP BY es más eficiente a futuro; se puede
 * migrar sin cambiar la interfaz pública de esta función.
 */
export async function obtenerSaldosPorCuenta(): Promise<SaldosPorCuentaResult>
```

### 5.8 Componente `AccountBalanceList`

Server Component (no necesita interactividad).

```
┌─────────────────────────────────────┐
│ Tus cuentas                         │
├─────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ │
│ │ Cuenta Banco  │ │ Efectivo      │ │
│ │ $2,450.00     │ │ $350.00       │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐                   │
│ │ Ahorros       │                   │
│ │ $8,100.00     │                   │
│ └───────────────┘                   │
└─────────────────────────────────────┘
```

Props: `cuentas: SaldoCuenta[]`

Variantes de color del saldo según umbral relativo al saldo inicial:
- Verde (`--success`): `saldoActual >= saldoInicial * 0.5`
- Amarillo (`--warning`): `saldoActual >= 0 && saldoActual < saldoInicial * 0.5`
- Rojo (`--destructive`): `saldoActual < 0`

---

## 6. Criterios de aceptación

- [ ] **AC-001:** La sección "Tus cuentas" aparece en el Dashboard debajo de los 6 indicadores globales
- [ ] **AC-002:** Cada cuenta muestra nombre y saldo actual calculado (no solo el saldo inicial)
- [ ] **AC-003:** El saldo por cuenta es consistente con el saldo global: la suma de `saldoActual` de todas las cuentas debe ser igual a `motor.saldoActual`
- [ ] **AC-004:** El color del saldo refleja el estado: verde cuando ≥ 50% del saldo inicial, amarillo cuando entre 0% y 49%, rojo cuando es negativo
- [ ] **AC-005:** Si el usuario no tiene cuentas registradas, se muestra un mensaje de guía con link a `/config`
- [ ] **AC-006:** La función `calcularSaldosPorCuenta()` tiene tests unitarios en `calculations.test.ts`
- [ ] **AC-007:** La sección es mobile-first y no rompe el layout existente (grid de 2 columnas de los indicadores)
- [ ] **AC-008:** No hay errores de TypeScript (`npx tsc --noEmit` pasa)
- [ ] **AC-009:** El saldo del Motor no se altera — solo se agrega información nueva, los 6 indicadores globales siguen funcionando igual

---

## 7. Plan de tareas

- [x] TAREA-001: Explorar código actual (dashboard, Motor, modelo de datos)
- [ ] TAREA-002: Agregar tipos `SaldoCuenta`, `SaldosPorCuentaResult`, `DatosPorCuenta` en `types.ts`
- [ ] TAREA-003: Implementar función pura `calcularSaldosPorCuenta()` en `calculations.ts` + tests en `calculations.test.ts`
- [ ] TAREA-004: Implementar función I/O `obtenerSaldosPorCuenta()` en `index.ts` y exportarla
- [ ] TAREA-005: Crear componente `src/components/dashboard/account-balance-list.tsx`
- [ ] TAREA-006: Modificar `dashboard/page.tsx` para llamar a `obtenerSaldosPorCuenta()` y renderizar `AccountBalanceList`
- [x] TAREA-007: QA — validar criterios de aceptación AC-001 a AC-009
- [x] TAREA-008: Architect — revisar arquitectura y aprobar
- [x] TAREA-009: Commit y merge a develop — completado 2026-10-05 19:00

---

## 8. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Pagos con `cuenta_id = NULL` (anteriores a migración 002) | Medio — no se descuentan de ninguna cuenta, podría haber descuadre entre saldo global y suma por cuentas | **Fase 1 (esta feature):** Documentación en la UI explicando el edge case. **Fase 2 (feature posterior `pagos-sin-asignar`):** UI interactiva donde el usuario puede ver los pagos sin asignar y reasignarlos a la cuenta correcta |
| Muchas cuentas con muchas transacciones → múltiples queries | Bajo (MVP) | La implementación actual es correcta; migrar a GROUP BY en el futuro si hay performance issues |
| Saldo negativo en una cuenta | Bajo | Mostrar en rojo, es información válida |

---

## 9. Notas adicionales

**Sobre el descuadre potencial entre saldo global y suma de saldos por cuenta:**

## 9. Notas adicionales

**Sobre el descuadre potencial entre saldo global y suma de saldos por cuenta:**

El Motor global descuenta `pagosPagados` con `cuenta_id IS NOT NULL`. La nueva función por cuenta hace lo mismo (solo descuenta pagos que tienen `cuenta_id`). Por lo tanto, si hay pagos con `cuenta_id = NULL`, esos pagos ya están descontados del saldo global pero NO aparecerán en ninguna cuenta individual. Esto es un edge case de migración.

**Estrategia de dos fases para resolverlo:**
- **Fase 1 (esta feature):** Documentar el edge case en la UI con un pequeño aviso. Así el usuario entiende por qué podría haber una pequeña diferencia.
- **Fase 2 (feature posterior `pagos-sin-asignar`):** Crear una UI interactiva donde el usuario vea la lista de pagos sin `cuenta_id` asignada y pueda reasignarlos a la cuenta correcta.

**Por qué no usar GROUP BY ahora:**
La implementación propuesta hace queries simples que el código ya sabe hacer (mismo patrón que `obtenerDatosMotor`). Un GROUP BY sería más eficiente pero requiere más SQL y complejidad. Para MVP con pocos usuarios y pocas cuentas, el approach simple es el correcto.

**Ubicación de la nueva sección:**
Debajo de los 6 indicadores globales, antes del empty state. Así el flujo de lectura es: resumen global → detalle por cuenta → acción de inicio (si aplica).
