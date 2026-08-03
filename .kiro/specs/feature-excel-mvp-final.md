# OpenFinanceKit

**Documento:** SDD — feature/excel-mvp-final

**Versión:** 0.1.0

**Estado:** Draft

**Sprint:** Sprint 1

**Rama:** feature/excel-mvp-final

**Issue:** N/A

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-03

---

## 1. Resumen

Reconstruir el archivo OpenFinanceKit.xlsx como MVP final, corrigiendo las 6 hojas para que estén completas, funcionales y con todas las validaciones y cálculos necesarios.

---

## 2. Contexto y motivación

El Excel actual tiene las hojas y tablas creadas pero con detalles pendientes: tablas con referencias muy ajustadas, falta de indicadores clave en Motor/Dashboard, y el estado de Pagos es completamente manual. El MVP debe responder a 5 preguntas financieras sin intervención manual.

---

## 3. Objetivos

- [x] Configuración completa y validada
- [ ] Ingresos funcional con validaciones y espacio para crecer
- [ ] Gastos funcional con validaciones y espacio para crecer
- [ ] Pagos con determinación automática de Vencido desde Motor
- [ ] Motor con todos los cálculos: saldo, ingresos, gastos, pendiente, disponible, % gastado
- [ ] Dashboard con 6 indicadores útiles

---

## 4. Fuera de alcance

- No incluye: gráficos
- No incluye: formato condicional avanzado (solo básico en balance)
- No incluye: múltiples monedas
- No incluye: subcategorías
- No incluye: automatizaciones Python

---

## 5. Diseño técnico

### 5.1 Archivos afectados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `product/excel/OpenFinanceKit.xlsx` | Reconstruir | Todas las 6 hojas |

### 5.2 Estructura de hojas

| Hoja | Tabla | Campos |
|------|-------|--------|
| Configuración | tblCategorias | CategoriaID, Nombre, Tipo |
| Configuración | tblCuentas | CuentaID, Nombre, SaldoInicial |
| Configuración | tblParametros | Parametro, Valor |
| Ingresos | tblIngresos | ID, Fecha, Categoria, Cuenta, Valor, Descripcion |
| Gastos | tblGastos | ID, Fecha, Categoria, Cuenta, Valor, Descripcion |
| Pagos | tblPagos | ID, Concepto, FechaVencimiento, Valor, Estado |

### 5.3 Reglas de negocio aplicables

| RN | Descripción |
|----|-------------|
| RN-001 | Configuración es la única fuente de datos maestros |
| RN-002 | Motor es la única hoja autorizada para cálculos |
| RN-003 | Dashboard solo visualiza |
| RN-004 | Hojas de captura solo almacenan datos |
| RN-005 | Listas desplegables desde Configuración |
| RN-006 | Tablas permiten nuevas filas sin modificar fórmulas |

### 5.4 Motor — Cálculos a implementar

| Indicador | Fórmula |
|-----------|---------|
| Total Ingresos del mes | SUMPRODUCT con YEAR/MONTH vs MesActual |
| Total Gastos del mes | SUMPRODUCT con YEAR/MONTH vs MesActual |
| Balance del mes | Ingresos - Gastos |
| Saldo actual total | SaldoInicial + Ingresos históricos - Gastos históricos |
| Pendiente de pago | SUMIF Estado="Pendiente" |
| Total vencido | SUMIF Estado="Vencido" |
| Disponible restante | Saldo actual - Pendiente |
| % Gastado | Gastos mes / Ingresos mes |

### 5.5 Dashboard — 6 indicadores finales

1. **Saldo actual** — ¿Cuánto tengo hoy?
2. **Ingresos del mes** — ¿Cuánto entró este mes?
3. **Gastos del mes** — ¿Cuánto gasté este mes?
4. **Pendiente por pagar** — ¿Cuánto debo pagar todavía?
5. **Disponible restante** — ¿Cuánto me queda libre?
6. **% Gastado** — ¿Qué porcentaje de mis ingresos ya gasté?

### 5.6 Pagos — Estado Vencido

El campo Estado en tblPagos sigue siendo manual (Pendiente/Pagado/Vencido). El usuario registra cuando paga (cambia a Pagado). Motor calcula cuánto está vencido sumando los que tienen Estado="Vencido". El usuario marca manualmente como Vencido o puede usarse formato condicional para resaltarlo visualmente.

---

## 6. Criterios de aceptación

- [ ] AC-001: Puedo registrar un ingreso con categoría y cuenta desde lista desplegable
- [ ] AC-002: Puedo registrar un gasto con categoría y cuenta desde lista desplegable
- [ ] AC-003: Puedo registrar un pago con estado Pendiente/Pagado/Vencido
- [ ] AC-004: El Motor calcula saldo actual correctamente
- [ ] AC-005: El Motor calcula disponible restante (saldo - pendiente)
- [ ] AC-006: El Motor calcula % gastado (gastos/ingresos del mes)
- [ ] AC-007: El Dashboard muestra los 6 indicadores sin fórmulas propias (solo refs a Motor)
- [ ] AC-008: Al agregar filas a las tablas, las fórmulas no se rompen

---

## 7. Plan de tareas

- [ ] TAREA-001: Reconstruir hoja Configuración (tablas verticales, validaciones completas)
- [ ] TAREA-002: Reconstruir hoja Ingresos (tabla expandida, validaciones)
- [ ] TAREA-003: Reconstruir hoja Gastos (tabla expandida, validaciones)
- [ ] TAREA-004: Reconstruir hoja Pagos (tabla expandida, validaciones)
- [ ] TAREA-005: Reconstruir hoja Motor (todos los cálculos del MVP)
- [ ] TAREA-006: Reconstruir hoja Dashboard (6 indicadores desde Motor)
- [ ] TAREA-007: Validar criterios de aceptación
- [ ] TAREA-008: Hook commit-message → aprobación del usuario
- [ ] TAREA-009: Merge a develop con autorización

---

## 8. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| openpyxl no soporta todo el formato condicional de Excel | Bajo | Usar solo formatos básicos |
| Referencias estructuradas entre hojas pueden fallar | Medio | Validar cada referencia post-build |

---

## 9. Notas adicionales

- Se elimina toda la data de muestra que no sea mínima para probar funcionalidad
- Las tablas se crean con al menos 1 fila de datos de muestra para que Excel las reconozca como tablas
- El Dashboard es simple: solo texto + valores. Sin gráficos en el MVP.
