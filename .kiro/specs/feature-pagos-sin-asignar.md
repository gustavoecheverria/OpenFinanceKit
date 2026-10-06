# OpenFinanceKit

**Documento:** Software Design Document (SDD) — Pagos Sin Asignar

**Versión:** 0.1.0

**Estado:** En Desarrollo

**Sprint:** Sprint 3 (Deuda Técnica)

**Rama:** feature/pagos-sin-asignar

**Issue:** —

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-10-05

---

## 1. Resumen

Crear una UI interactiva que permita al usuario ver los pagos antiguos sin `cuenta_id` asignada y reasignarlos a la cuenta correcta. Esto resuelve el descuadre entre saldo global y suma de saldos por cuenta causado por pagos creados antes de la migración 002.

---

## 2. Contexto y motivación

Antes de la migración 002 (2026-08-28), los pagos no tenían campo `cuenta_id`. Por lo tanto:
- Esos pagos se descuentan del **saldo global** (Motor suma todos los pagos pagados)
- Pero NO se descuentan de **ninguna cuenta individual** (porque no saben de dónde salieron)

Resultado: **Suma de saldos por cuenta ≠ Saldo global**

El usuario no sabe por qué hay una diferencia. Necesita una UI para:
1. Ver qué pagos están sin asignar
2. Decidir de qué cuenta vinieron
3. Reasignarlos y que los saldos se corrijan automáticamente

---

## 3. Objetivos

- [ ] OBJ-001: Crear página `/pagos/sin-asignar` que liste pagos con `cuenta_id = NULL`
- [ ] OBJ-002: Mostrar monto total de pagos sin asignar
- [ ] OBJ-003: Formulario para seleccionar cuenta y reasignar pago
- [ ] OBJ-004: Actualizar `cuenta_id` en la DB al reasignar
- [ ] OBJ-005: Validar que la suma de saldos por cuenta = saldo global DESPUÉS de reasignar
- [ ] OBJ-006: Notificar al usuario qué saldos se corrigieron

---

## 4. Fuera de alcance

- No incluye: Crear pagos directamente desde esta UI (solo reasignar)
- No incluye: Historial de cambios o auditoría
- No incluye: Reasignación en lote (uno a la vez por ahora)

---

## 5. Diseño técnico

### 5.1 Archivos afectados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/app/(app)/pagos/sin-asignar/page.tsx` | Crear | Página servidor que lista pagos sin cuenta_id |
| `src/app/(app)/pagos/sin-asignar/actions.ts` | Crear | Server action para reasignar pago a cuenta |
| `src/components/pagos/unassigned-payment-card.tsx` | Crear | Componente de tarjeta para un pago sin asignar |
| `src/lib/motor/index.ts` | Modificar | Agregar función `obtenerPagosSinAsignar()` |

### 5.2 Consulta SQL (read-only, no modifica)

```sql
SELECT id, concepto, fecha_vencimiento, valor, estado
FROM pagos
WHERE user_id = ? 
  AND cuenta_id IS NULL
  AND estado = 'Pagado'
ORDER BY fecha_vencimiento DESC;
```

### 5.3 Actualización (cuando reasigna)

```sql
UPDATE pagos
SET cuenta_id = ?
WHERE id = ? AND user_id = ? AND cuenta_id IS NULL;
```

### 5.4 Nueva función en Motor

```typescript
export async function obtenerPagosSinAsignar(): Promise<PagoSinAsignar[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data } = await supabase
    .from("pagos")
    .select("id, concepto, fecha_vencimiento, valor, estado")
    .eq("user_id", user.id)
    .is("cuenta_id", null)
    .eq("estado", "Pagado")
    .order("fecha_vencimiento", { ascending: false });
  
  return (data || []) as PagoSinAsignar[];
}

export async function reasignarPagoACuenta(
  pagoId: number,
  cuentaId: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "No autenticado" };
  
  // Validar que el pago pertenece al usuario
  const { data: pago } = await supabase
    .from("pagos")
    .select("id, user_id")
    .eq("id", pagoId)
    .eq("user_id", user.id)
    .single();
  
  if (!pago) {
    return { success: false, error: "Pago no encontrado" };
  }
  
  // Validar que la cuenta pertenece al usuario
  const { data: cuenta } = await supabase
    .from("cuentas")
    .select("id, user_id")
    .eq("id", cuentaId)
    .eq("user_id", user.id)
    .single();
  
  if (!cuenta) {
    return { success: false, error: "Cuenta no encontrada" };
  }
  
  // Reasignar
  const { error } = await supabase
    .from("pagos")
    .update({ cuenta_id: cuentaId })
    .eq("id", pagoId)
    .eq("user_id", user.id);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
```

### 5.5 Flujo de UI

```
Página /pagos/sin-asignar

┌─ Header ──────────────────────────────────────┐
│ Pagos sin asignar a cuenta                    │
│ Total: $XXX.XX                                │
└───────────────────────────────────────────────┘

┌─ Empty state (si no hay) ─────────────────────┐
│ ✅ No tienes pagos sin asignar                │
│    Todos están correctamente asignados        │
└───────────────────────────────────────────────┘

O

┌─ Lista ──────────────────────────────────────┐
│                                               │
│ ┌─ Pago 1 ─────────────────────────────────┐ │
│ │ Conceptooo                               │ │
│ │ $250.00 · Pagado                         │ │
│ │ Vto: 2026-08-15                          │ │
│ │                                          │ │
│ │ Asignar a: [Select Cuentas ▼]            │ │
│ │ [  Guardar  ] [  Cancelar  ]             │ │
│ └──────────────────────────────────────────┘ │
│                                               │
│ ┌─ Pago 2 ─────────────────────────────────┐ │
│ │ Otro pago                                │ │
│ │ $150.00 · Pagado                         │ │
│ │ Vto: 2026-07-20                          │ │
│ │                                          │ │
│ │ Asignar a: [Select Cuentas ▼]            │ │
│ │ [  Guardar  ] [  Cancelar  ]             │ │
│ └──────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘

Tras reasignar → Se recalculan saldos automáticamente
                 Modal de confirmación: "✅ Saldos actualizados"
```

---

## 6. Criterios de aceptación

- [ ] **AC-001:** Página `/pagos/sin-asignar` accesible desde nav
- [ ] **AC-002:** Muestra lista de pagos con `cuenta_id = NULL` y estado "Pagado"
- [ ] **AC-003:** Muestra total correcto de pagos sin asignar
- [ ] **AC-004:** Formulario con select de cuentas funciona
- [ ] **AC-005:** Reasignar actualiza la DB correctamente
- [ ] **AC-006:** Tras reasignar, el saldo de esa cuenta se actualiza en Dashboard
- [ ] **AC-007:** Suma de saldos por cuenta = saldo global (después de reasignar todos)
- [ ] **AC-008:** Empty state correcto cuando no hay pagos sin asignar
- [ ] **AC-009:** Mobile-first, no rompe layout

---

## 7. Plan de tareas

- [ ] TAREA-001: Crear función `obtenerPagosSinAsignar()` en Motor
- [ ] TAREA-002: Crear function `reasignarPagoACuenta()` en Motor
- [ ] TAREA-003: Crear página `/pagos/sin-asignar/page.tsx` (Server Component)
- [ ] TAREA-004: Crear `/pagos/sin-asignar/actions.ts` con Server Actions
- [ ] TAREA-005: Crear componente `UnassignedPaymentCard`
- [ ] TAREA-006: Agregar link en bottom-nav o nav para acceder a la página
- [ ] TAREA-007: QA — validar AC-001 a AC-009
- [ ] TAREA-008: Merge a develop
- [ ] TAREA-009: Liberar a Producción

---

## 8. Reglas de negocio aplicables

| RN | Descripción |
|----|-------------|
| RN-002 | Motor es la única capa autorizada para cálculos |
| RN-003 | Dashboard solo visualiza, no modifica |
| RN-004 | Modificaciones de datos solo vía Server Actions |

---

## 9. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Usuario reasigna pago a cuenta incorrecta | Medio | Validación en UI, poder cambiar de nuevo |
| Race condition: dos reasignaciones simultáneas | Bajo | PK en BD evita duplicación |
| Performance: muchos pagos sin asignar | Bajo | Índice en (user_id, cuenta_id) |

---

## 10. Notas

- Esta feature resuelve la Fase 2 del plan de dos fases del SDD de "Saldos por Cuenta"
- Una vez reasignados todos los pagos, los saldos deberían coincidir
- Recomendación: Mostrar un badge en nav de pagos si hay sin asignar
