# OpenFinanceKit

**Documento:** Project Specification — MVP

**Versión:** 0.1.0

**Estado:** Sprint 1 — MVP

**Sprint:** Sprint 1

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-03

---

# 1. Objetivo

OpenFinanceKit es un sistema para administrar finanzas personales.

La primera versión será un archivo de Excel.

El objetivo del MVP es permitir registrar ingresos, gastos y pagos, calcular el estado financiero del mes y visualizar un resumen general.

La prioridad es construir una solución simple, estable y fácil de mantener.

---

# 2. Principios del proyecto

El desarrollo del MVP seguirá estos principios:

- Primero funcionalidad, luego complejidad.
- No duplicar información.
- Cada hoja tiene una única responsabilidad.
- Todos los cálculos viven en una sola hoja.
- Toda mejora debe mantener la simplicidad del sistema.

---

# 3. Arquitectura del libro

El archivo principal será:

`OpenFinanceKit.xlsx`

Contendrá las siguientes hojas:

| # | Hoja | Responsabilidad |
|---|------|----------------|
| 1 | README | Describe cómo utilizar el archivo |
| 2 | LOG | Historial de cambios |
| 3 | Configuración | Datos maestros (categorías, cuentas, parámetros) |
| 4 | Ingresos | Registro de ingresos |
| 5 | Gastos | Registro de gastos |
| 6 | Pagos | Registro de pagos programados |
| 7 | Motor | Todos los cálculos del sistema |
| 8 | Dashboard | Visualización de indicadores |

---

# 4. Responsabilidad de cada hoja

## README

Describe cómo utilizar el archivo.

---

## LOG

Historial de cambios del libro.

---

## Configuración

Contiene únicamente la información base utilizada por el resto del sistema.

- No almacena movimientos.
- No realiza cálculos.

---

## Ingresos

Registra todos los ingresos.

- No realiza cálculos.

---

## Gastos

Registra todos los gastos.

- No realiza cálculos.

---

## Pagos

Registra pagos programados y su estado.

- No realiza cálculos.

---

## Motor

Realiza todos los cálculos del sistema.

- Ninguna otra hoja debe contener lógica de negocio.

---

## Dashboard

Presenta indicadores y resúmenes.

- Nunca almacena información.

---

# 5. Flujo del sistema

```
Configuración
      ↓
Ingresos | Gastos | Pagos
      ↓
    Motor
      ↓
  Dashboard
```

---

# 6. Tablas del sistema

## Configuración

### tblCategorias

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| CategoriaID | Número | Sí |
| Nombre | Texto | Sí |
| Tipo | Lista (Ingreso/Gasto) | Sí |

### tblCuentas

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| CuentaID | Número | Sí |
| Nombre | Texto | Sí |
| SaldoInicial | Moneda | Sí |

### tblParametros

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| Parametro | Texto | Sí |
| Valor | Texto/Número | Sí |

## Ingresos

### tblIngresos

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| ID | Número | Sí |
| Fecha | Fecha | Sí |
| Categoria | Lista | Sí |
| Cuenta | Lista | Sí |
| Valor | Moneda | Sí |
| Descripcion | Texto | No |

## Gastos

### tblGastos

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| ID | Número | Sí |
| Fecha | Fecha | Sí |
| Categoria | Lista | Sí |
| Cuenta | Lista | Sí |
| Valor | Moneda | Sí |
| Descripcion | Texto | No |

## Pagos

### tblPagos

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| ID | Número | Sí |
| Concepto | Texto | Sí |
| FechaVencimiento | Fecha | Sí |
| Valor | Moneda | Sí |
| Estado | Lista (Pendiente/Pagado/Vencido) | Sí |

---

# 7. Diccionario de campos

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| Fecha | Fecha | Sí |
| Valor | Moneda | Sí |
| Categoria | Lista | Sí |
| Cuenta | Lista | Sí |
| Descripcion | Texto | No |
| Estado | Lista | Sí |

Los campos deben mantener el mismo significado en todas las hojas donde aparezcan.

---

# 8. Reglas de negocio

| ID | Regla |
|----|-------|
| RN-001 | Configuración es la única fuente de datos maestros |
| RN-002 | Motor es la única hoja autorizada para realizar cálculos |
| RN-003 | Dashboard únicamente visualiza información |
| RN-004 | Las hojas de captura solo almacenan datos |
| RN-005 | Las listas desplegables deben obtener sus valores desde Configuración |
| RN-006 | Las tablas deben permitir agregar nuevas filas sin modificar fórmulas |

---

# 9. Criterios de aceptación del MVP

El MVP estará terminado cuando sea posible:

- [ ] Registrar ingresos
- [ ] Registrar gastos
- [ ] Registrar pagos
- [ ] Consultar el saldo actual
- [ ] Consultar cuánto falta por pagar
- [ ] Visualizar un resumen mensual

No se requiere automatización para esta versión.

---

# 10. Backlog — Versiones futuras

Las siguientes funcionalidades no forman parte del MVP:

- Automatizaciones con n8n
- Integración con GitHub Actions
- Múltiples monedas
- Subcategorías
- Métodos de pago
- IA
- Power BI
- Aplicación Web
- API

---

# 11. Instrucciones para el Agente IA

Construye el archivo `OpenFinanceKit.xlsx` siguiendo esta especificación.

**Reglas:**

- No modificar la arquitectura sin autorización
- Utilizar Tablas de Excel para toda la información
- Utilizar referencias estructuradas
- No duplicar información
- Mantener el diseño simple
- Priorizar funcionalidad sobre complejidad
- Si detectas una mejora importante, propónla antes de implementarla
