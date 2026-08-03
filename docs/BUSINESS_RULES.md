# Reglas de Negocio — OpenFinanceKit

## Dominio

### Definición del Dominio

OpenFinanceKit opera dentro del dominio de **gestión financiera empresarial**, abarcando las áreas de contabilidad, facturación, presupuestos, tesorería y reportes financieros. El sistema gestiona el ciclo completo de vida de las transacciones financieras, desde su registro hasta su conciliación y reporte.

### Alcance del Dominio

| Área | Descripción |
|------|-------------|
| Contabilidad | Registro de asientos contables bajo partida doble |
| Facturación | Emisión, recepción y gestión de facturas |
| Presupuestos | Planificación, asignación y control presupuestario |
| Tesorería | Gestión de flujos de caja y cuentas bancarias |
| Reportes | Generación de estados financieros y reportes gerenciales |

### Principios del Dominio

- Todo movimiento financiero debe ser trazable y auditable.
- El sistema debe cumplir con las Normas Internacionales de Información Financiera (NIIF/IFRS).
- La integridad de los datos financieros es prioritaria sobre la disponibilidad.
- Los períodos contables definen los límites temporales de las operaciones.

---

## Entidades

### Entidades Principales

| Entidad | Descripción | Identificador |
|---------|-------------|---------------|
| Cuenta Contable | Clasificación del plan de cuentas | Código contable (ej: 1.1.01.001) |
| Asiento Contable | Registro de movimientos bajo partida doble | ID secuencial por período |
| Factura | Documento comercial de compra o venta | Número de factura + serie |
| Presupuesto | Plan de asignación de recursos financieros | ID + período fiscal |
| Transacción | Movimiento individual de fondos | ID único (UUID) |
| Período Contable | Intervalo temporal para agrupación de operaciones | Año-Mes |
| Centro de Costo | Unidad organizacional para asignación de gastos | Código jerárquico |
| Tercero | Cliente, proveedor o entidad relacionada | NIF/RUC/RFC |

### Relaciones entre Entidades

- Un **Asiento Contable** contiene dos o más **líneas de asiento** (débitos y créditos).
- Una **Factura** genera uno o más **Asientos Contables**.
- Un **Presupuesto** se asigna a uno o más **Centros de Costo**.
- Una **Transacción** pertenece a exactamente un **Período Contable**.
- Un **Tercero** puede estar asociado a múltiples **Facturas** como emisor o receptor.

---

## Reglas

### Reglas de Contabilidad

| ID | Regla | Categoría |
|----|-------|-----------|
| RN-CONT-001 | Todo asiento contable debe cumplir la partida doble: la suma de débitos debe ser igual a la suma de créditos | Integridad |
| RN-CONT-002 | No se permite registrar asientos en períodos contables cerrados | Temporal |
| RN-CONT-003 | Las cuentas contables deben seguir la estructura jerárquica del plan de cuentas vigente | Estructura |
| RN-CONT-004 | Un asiento contable debe tener al menos dos líneas (una de débito y una de crédito) | Estructura |
| RN-CONT-005 | Los asientos de ajuste deben estar marcados con el tipo "AJUSTE" y requieren aprobación de un contador autorizado | Autorización |
| RN-CONT-006 | Las cuentas de resultado (ingresos y gastos) se cierran al final de cada período fiscal | Temporal |

### Reglas de Facturación

| ID | Regla | Categoría |
|----|-------|-----------|
| RN-FACT-001 | Toda factura emitida debe tener un número secuencial único dentro de su serie | Unicidad |
| RN-FACT-002 | Una factura no puede ser eliminada después de su emisión; solo puede anularse generando una nota de crédito | Inmutabilidad |
| RN-FACT-003 | El monto total de la factura debe ser igual a la suma de los ítems más impuestos aplicables | Cálculo |
| RN-FACT-004 | Las facturas vencidas por más de 30 días deben generar una alerta de cobranza | Gestión |
| RN-FACT-005 | Una factura debe estar asociada a un tercero válido registrado en el sistema | Referencial |

### Reglas de Presupuesto

| ID | Regla | Categoría |
|----|-------|-----------|
| RN-PRES-001 | No se permite registrar gastos que excedan el presupuesto asignado al centro de costo sin aprobación de nivel superior | Control |
| RN-PRES-002 | Las transferencias entre partidas presupuestarias deben mantener el total del presupuesto global sin cambios | Equilibrio |
| RN-PRES-003 | El presupuesto debe estar aprobado antes del inicio del período fiscal al que corresponde | Temporal |
| RN-PRES-004 | Las modificaciones presupuestarias superiores al 10% del monto original requieren aprobación del directorio | Autorización |

### Reglas de Tesorería

| ID | Regla | Categoría |
|----|-------|-----------|
| RN-TES-001 | Todo pago debe estar respaldado por un documento fuente (factura, contrato, orden de compra) | Trazabilidad |
| RN-TES-002 | Los pagos superiores a un monto umbral (configurable) requieren doble autorización | Seguridad |
| RN-TES-003 | La conciliación bancaria debe realizarse antes del cierre de cada período contable | Temporal |
| RN-TES-004 | No se permite el saldo negativo en cuentas bancarias sin una línea de crédito aprobada | Restricción |

---

## Validaciones

### Validaciones de Datos de Entrada

| ID | Campo/Entidad | Validación | Tipo |
|----|---------------|-----------|------|
| VAL-001 | Monto de transacción | Debe ser un número positivo con máximo 2 decimales | Formato |
| VAL-002 | Fecha de transacción | No puede ser una fecha futura para operaciones normales | Lógica |
| VAL-003 | Código de cuenta | Debe existir en el plan de cuentas activo | Referencial |
| VAL-004 | NIF/RUC del tercero | Debe cumplir el formato y dígito verificador del país configurado | Formato |
| VAL-005 | Número de factura | Debe ser único dentro de la serie y seguir el formato alfanumérico configurado | Unicidad |
| VAL-006 | Período contable | Debe estar en estado "abierto" para aceptar nuevas transacciones | Estado |
| VAL-007 | Moneda | Debe ser un código ISO 4217 válido y estar habilitada en el sistema | Catálogo |
| VAL-008 | Tipo de cambio | Debe ser positivo y no exceder un umbral de variación del 5% respecto al día anterior | Rango |

### Validaciones de Integridad

| ID | Contexto | Validación |
|----|----------|-----------|
| VAL-INT-001 | Asiento contable | Suma de débitos == Suma de créditos (diferencia máxima permitida: 0.00) |
| VAL-INT-002 | Cierre de período | Todas las transacciones del período deben estar conciliadas |
| VAL-INT-003 | Balance general | Activos == Pasivos + Patrimonio (ecuación contable fundamental) |
| VAL-INT-004 | Factura | Subtotal + Impuestos == Total (sin tolerancia de redondeo superior a 0.01) |

### Validaciones de Estado

| ID | Entidad | Transiciones Permitidas |
|----|---------|------------------------|
| VAL-EST-001 | Factura | Borrador → Emitida → Pagada / Anulada |
| VAL-EST-002 | Asiento | Borrador → Registrado → Aprobado / Rechazado |
| VAL-EST-003 | Presupuesto | Borrador → En Revisión → Aprobado → Vigente → Cerrado |
| VAL-EST-004 | Período Contable | Abierto → En Cierre → Cerrado |

---

## Flujos

### Flujo 1: Registro de Asiento Contable

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  Crear      │────▶│  Validar     │────▶│  Registrar    │────▶│  Aprobar    │
│  Borrador   │     │  Partida     │     │  Asiento      │     │  Asiento    │
│             │     │  Doble       │     │               │     │             │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
                          │                                           │
                          ▼                                           ▼
                    ┌──────────────┐                          ┌─────────────┐
                    │  Rechazar    │                          │  Contabilizar│
                    │  (error en   │                          │  en Mayor   │
                    │  cuadre)     │                          │             │
                    └──────────────┘                          └─────────────┘
```

**Pasos:**
1. El usuario crea un asiento en estado borrador con las líneas de débito y crédito.
2. El sistema valida que la suma de débitos sea igual a la suma de créditos (RN-CONT-001).
3. El sistema valida que el período contable esté abierto (RN-CONT-002).
4. El sistema registra el asiento con un número secuencial.
5. Un contador autorizado aprueba el asiento.
6. El asiento se refleja en el libro mayor.

### Flujo 2: Ciclo de Vida de Factura

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  Crear      │────▶│  Validar     │────▶│  Emitir       │────▶│  Registrar  │
│  Factura    │     │  Datos       │     │  Factura      │     │  Cobro/Pago │
│             │     │              │     │               │     │             │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
                          │                     │                      │
                          ▼                     ▼                      ▼
                    ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
                    │  Corregir    │     │  Anular       │     │  Cerrar     │
                    │  Errores     │     │  (Nota de     │     │  Factura    │
                    │              │     │   Crédito)    │     │             │
                    └──────────────┘     └───────────────┘     └─────────────┘
```

**Pasos:**
1. El usuario crea una factura con datos del tercero e ítems.
2. El sistema valida datos obligatorios, cálculos y existencia del tercero (RN-FACT-003, RN-FACT-005).
3. La factura se emite con número secuencial único (RN-FACT-001).
4. Se genera automáticamente el asiento contable correspondiente.
5. Al recibir el pago, se registra y la factura pasa a estado "Pagada".
6. Si se requiere anulación, se genera nota de crédito (RN-FACT-002).

### Flujo 3: Control Presupuestario

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  Solicitar  │────▶│  Verificar   │────▶│  Autorizar    │────▶│  Ejecutar   │
│  Gasto      │     │  Disponible  │     │  Gasto        │     │  Gasto      │
│             │     │              │     │               │     │             │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
                          │                     │
                          ▼                     ▼
                    ┌──────────────┐     ┌───────────────┐
                    │  Rechazar    │     │  Escalar      │
                    │  (sin saldo) │     │  Aprobación   │
                    │              │     │  (excede %)   │
                    └──────────────┘     └───────────────┘
```

**Pasos:**
1. Un responsable de centro de costo solicita un gasto.
2. El sistema verifica disponibilidad presupuestaria en la partida correspondiente.
3. Si hay saldo disponible, se autoriza el gasto (según nivel de monto).
4. Si el gasto excede el presupuesto, se aplica RN-PRES-001 (requiere aprobación superior).
5. Si la modificación supera el 10%, se escala al directorio (RN-PRES-004).
6. El gasto ejecutado se descuenta del presupuesto disponible.

### Flujo 4: Conciliación Bancaria

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  Importar   │────▶│  Comparar    │────▶│  Conciliar    │────▶│  Generar    │
│  Extracto   │     │  Movimientos │     │  Partidas     │     │  Reporte    │
│  Bancario   │     │              │     │               │     │             │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
                          │                     │
                          ▼                     ▼
                    ┌──────────────┐     ┌───────────────┐
                    │  Marcar      │     │  Registrar    │
                    │  Discrepancia│     │  Ajustes      │
                    │              │     │               │
                    └──────────────┘     └───────────────┘
```

**Pasos:**
1. Se importa el extracto bancario (archivo o conexión directa).
2. El sistema compara los movimientos del banco con los registros internos.
3. Las partidas coincidentes se concilian automáticamente.
4. Las discrepancias se marcan para revisión manual.
5. Se registran ajustes contables si es necesario (RN-CONT-005).
6. Se genera un reporte de conciliación para el cierre del período (RN-TES-003).

---

## Notas Adicionales

- Las reglas de negocio se revisan al inicio de cada sprint para reflejar cambios regulatorios.
- Los montos umbrales y porcentajes son configurables por organización.
- El sistema debe mantener un log de auditoría de todas las operaciones financieras.
