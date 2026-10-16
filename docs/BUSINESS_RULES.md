# OpenFinanceKit

**Documento:** Reglas de Negocio
**Versión:** 0.3.0
**Estado:** Vigente
**Release descrito:** v0.3.0 (pendiente de publicar)
**Autor:** Gustavo Echeverría
**Última actualización:** 2026-10-16

---

> **Nota de revisión.** Hasta el 2026-10-16 este documento describía reglas de
> contabilidad empresarial (partida doble, facturación, presupuestos, conciliación
> bancaria) que **este proyecto nunca implementó**. Era visión, no producto. Lo que
> sigue son las reglas que el código de `apps/web/` aplica de verdad. La visión de ERP
> está al final, en el [Anexo](#anexo-visión-no-implementada).

---

## Dominio

OpenFinanceKit gestiona **finanzas personales**: cuentas, categorías y los movimientos
de dinero entre ellas.

No hay contabilidad, no hay facturación, no hay impuestos. El objetivo es que una
persona mire su pantalla y sepa cuánto tiene, de dónde y a qué se va.

### Conceptos del dominio

| Concepto | Qué es |
|----------|--------|
| **Cuenta** | Dónde está el dinero. "Efectivo" es una cuenta más de la lista |
| **Categoría** | Para qué es el dinero. Cada una es de tipo Ingreso o Gasto |
| **Ingreso / Gasto** | Un movimiento real de dinero que el usuario registró |
| **Pago programado** | Una plantilla que se renueva sola. No es un movimiento hasta que se paga |
| **Transferencia** | Mover saldo de una cuenta a otra. No crea ni destruye dinero |

---

## Reglas de arquitectura

Estas son las reglas más importantes del proyecto. Violarlas rompe la app.

| ID | Regla |
|----|-------|
| **RN-001** | Configuración es la única fuente de datos maestros. Nada se captura sin una categoría y una cuenta existentes |
| **RN-002** | El Motor es el único lugar donde hay cálculos. Las páginas solo guardan y muestran |
| **RN-003** | El Dashboard solo visualiza. Nunca almacena información propia |
| **RN-004** | Las pantallas de captura (Ingresos, Gastos, Pagos, Transferencias) solo almacenan datos |
| **RN-005** | Los desplegables obtienen sus valores desde Configuración |
| **RN-006** | Las tablas admiten nuevas filas sin necesidad de cambiar fórmulas ni código |

El Motor vive en `apps/web/src/lib/motor/` y es **puro**: sin I/O, sin Supabase, sin
`next/headers`. Por eso se puede testear sin base de datos.

---

## Reglas de cuentas y categorías

| ID | Regla |
|----|-------|
| RN-CUE-001 | `saldo_inicial` no puede ser negativo |
| RN-CUE-002 | "Efectivo" no es un caso especial: es una fila de `cuentas` con su propio saldo |
| RN-CUE-003 | No se puede borrar una cuenta que tenga ingresos, gastos, transferencias o pagos programados asociados. La base lo bloquea (`ON DELETE RESTRICT`) y la app avisa |
| RN-CAT-001 | Cada categoría es de un solo tipo: Ingreso o Gasto. No hay subcategorías |
| RN-CAT-002 | No se puede borrar una categoría en uso |

---

## Reglas de movimientos

| ID | Regla |
|----|-------|
| RN-MOV-001 | `valor` siempre mayor que cero |
| RN-MOV-002 | `fecha` es una fecha de negocio: sin hora ni zona horaria. El día que registra el usuario es el día que cuenta |
| RN-MOV-003 | Todo movimiento pertenece a una cuenta y a una categoría. Ambas obligatorias |
| RN-MOV-004 | La suma de los saldos de todas las cuentas siempre cuadra con el saldo global |

---

## Reglas de transferencias

| ID | Regla |
|----|-------|
| RN-TRANS-001 | Una transferencia **no altera el saldo global**. Solo redistribuye entre cuentas |
| RN-TRANS-002 | No se puede transferir a la misma cuenta: sería un bucle sin efecto. La base lo bloquea |
| RN-TRANS-003 | El valor debe ser mayor que cero |
| RN-TRANS-004 | La cuenta de origen debe tener saldo suficiente. **Se valida en la server action, no en la base**, porque requiere leer el saldo actual, que es un cálculo y no un dato de la fila |
| RN-TRANS-005 | No se puede borrar una cuenta con transferencias registradas. El historial debe quedar consistente |

---

## Reglas de pagos programados

Estas son las reglas del módulo más reciente. Todas están implementadas y cubiertas por
tests en `src/lib/motor/programados.test.ts` y `fechas.test.ts`.

### Qué es un pago programado

Una **plantilla recurrente**, no un movimiento. El usuario la registra una vez (arriendo,
sueldo, cuota) y cada período marca "pagado". Ahí recién se genera el movimiento real
en `gastos` o `ingresos`.

La diferencia con un movimiento es la razón de ser del módulo: antes, marcar un pago
como pagado solo cambiaba una etiqueta de estado, sin crear nada en el historial.

| ID | Regla |
|----|-------|
| RN-PAG-001 | La cuenta de origen es **obligatoria**. No puede ser nula |
| RN-PAG-002 | La categoría es **obligatoria** y la elige el usuario al crear. No se asigna sola |
| RN-PAG-003 | Si el usuario no tiene ninguna categoría del tipo, el formulario lo obliga a crear una antes de continuar |
| RN-PAG-004 | El tipo (`Gasto` / `Ingreso`) determina a qué lado del historial va el movimiento cuando se paga |
| RN-PAG-005 | Marcar "pagado" genera el registro real en `gastos` o `ingresos` con la categoría elegida, y renueva el vencimiento al siguiente período |

### Recurrencia

| ID | Regla |
|----|-------|
| RN-REC-001 | Solo existen tres recurrencias: `Mensual`, `Quincenal`, `Semanal` |
| RN-REC-002 | **No existe la recurrencia diaria.** Con un ciclo de 1 día, la ventana de alerta de 5 días no cabe dentro del ciclo y el pago caería en alerta permanentemente, incluso recién pagado |
| RN-REC-003 | "Quincenal" es por **fechas de mes**, no 15 días corridos: vence el día configurado y ese día + 15. Con días corridos un arriendo del 31 se movería al 15 y cambiaría de fecha cada mes |
| RN-REC-004 | `dia_vencimiento` va de 1 a 31. Para el día 31 en meses cortos se usa el último día del mes |

### Estado

| ID | Regla |
|----|-------|
| RN-EST-001 | El estado **no se guarda en la base**. Se calcula en cada render a partir de `fecha_ultimo_pago`, `dia_vencimiento`, `recurrencia` y hoy |
| RN-EST-002 | Los estados posibles son: Al día, Pendiente, Alerta, Vencido |
| RN-EST-003 | La ventana de alerta es de **5 días** antes del vencimiento |
| RN-EST-004 | Un pago recién pagado nunca genera alerta. Está en período de gracia |
| RN-EST-005 | Todo el cálculo es a nivel de **día**, no de instante. Un pago que vence hoy no puede aparecer como vencido por la hora del servidor |
| RN-EST-006 | Si el pago nunca se pagó y `fecha_inicio` ya pasó, el vencimiento mostrado es el **próximo**, no el atraso histórico más lejano |

RN-EST-001 es la razón por la que no hay jobs programados en el proyecto: la plantilla
se renueva sola porque solo hay fechas, no un estado que vence.

### Baja

| ID | Regla |
|----|-------|
| RN-BAJ-001 | Un pago programado **no se borra**. Se desactiva con `activo = FALSE` |
| RN-BAJ-002 | Desactivar conserva el registro y su historial, solo deja de aparecer en la lista |
| RN-BAJ-003 | Un pago desactivado se puede reactivar |
| RN-BAJ-004 | No se puede borrar una cuenta o categoría con pagos programados activos asociados |

---

## Validaciones

| ID | Campo | Validación |
|----|-------|-----------|
| VAL-001 | `valor` (todas las tablas de monto) | Número positivo, máximo 2 decimales |
| VAL-002 | `fecha` | Se permite fecha futura en pagos programados; en ingresos y gastos es la fecha en que ocurrió el movimiento |
| VAL-003 | `categoria_id` / `cuenta_id` | Debe existir y pertenecer al usuario |
| VAL-004 | `concepto` (pago programado) | Entre 1 y 255 caracteres |
| VAL-005 | `concepto` (transferencia) | Máximo 255 caracteres, opcional |
| VAL-006 | `tipo` (categoría) | Exactamente `'Ingreso'` o `'Gasto'` |
| VAL-007 | `recurrencia` | Solo los tres valores permitidos |
| VAL-008 | Transferencia | Origen distinto del destino, con saldo suficiente |

---

## Reglas de UI

| ID | Regla |
|----|-------|
| RN-UI-001 | Mobile-first. Todo se usa con una mano, en pantalla chica |
| RN-UI-002 | Los textos de la interfaz usan **tuteo, nunca voseo** |
| RN-UI-003 | Cada mensaje dice la verdad: si una acción hace algo distinto de lo que el texto promete, el texto está mal |

RN-UI-002 y RN-UI-003 están porque se incumplieron en la práctica. El comando para
verificar RN-UI-002 está en `.kiro/skills/ofk-conventions.md`.

---

## Anexo: visión no implementada

La investigación de agosto de 2026 exploró un OFK empresarial. **Nada de esto existe
en el código.** Se documenta solo para preservar el contexto.

| Área | Estado |
|------|--------|
| Contabilidad bajo partida doble (`asiento_contable`, `linea_asiento`) | ❌ No implementada |
| Facturación (`factura`, `linea_factura`, `tercero`) | ❌ No implementada |
| Presupuestos (`presupuesto`, `centro_costo`) | ❌ No implementada |
| Períodos contables con cierre | ❌ No implementada |
| Conciliación bancaria | ❌ No implementada |
| Umbrales de doble autorización | ❌ No implementada |
| Normas IFRS | ❌ Fuera del alcance |

Retomar esa visión no es una evolución incremental: cambia el modelo de datos entero,
el Motor y la arquitectura. Es un proyecto aparte.