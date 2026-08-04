---
name: Feature Template — SDD
description: Template obligatorio para iniciar cualquier feature. Define el SDD y las tareas de implementación.
---

# OpenFinanceKit

**Documento:** Software Design Document (SDD) — [Nombre de la Feature]

**Versión:** 0.1.0

**Estado:** Draft

**Sprint:** Sprint [N]

**Rama:** feature/[nombre-de-la-rama]

**Issue:** #[número]

**Autor:** Gustavo Echeverría

**Última actualización:** [YYYY-MM-DD]

---

## 1. Resumen

<!-- Una o dos oraciones que describan qué hace esta feature y por qué existe. -->

---

## 2. Contexto y motivación

<!-- ¿Qué problema resuelve? ¿Qué solicitud del usuario origina esta feature?
     ¿Qué pasaría si no se implementa? -->

---

## 3. Objetivos

<!-- Lista de objetivos concretos que debe cumplir esta feature. -->

- [ ] Objetivo 1
- [ ] Objetivo 2
- [ ] Objetivo 3

---

## 4. Fuera de alcance

<!-- Qué NO hace esta feature. Evita scope creep. -->

- No incluye:
- No incluye:

---

## 5. Diseño técnico

### 5.1 Archivos afectados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `ruta/archivo` | Crear / Modificar / Eliminar | Qué cambia |

### 5.2 Cambios en el modelo de datos

<!-- Si aplica: nuevas tablas, campos o relaciones. -->

### 5.3 Reglas de negocio aplicables

<!-- Referencia a las RN del PROJECT_SPECIFICATION.md que aplican. -->

| RN | Descripción |
|----|-------------|
| RN-00X | ... |

### 5.4 Fórmulas o lógica nueva

<!-- Si aplica: fórmulas de Excel, lógica de scripts, etc. -->

---

## 6. Criterios de aceptación

<!-- Lista verificable de condiciones que deben cumplirse para considerar la feature completa. -->

- [ ] AC-001: 
- [ ] AC-002: 
- [ ] AC-003: 

---

## 7. Plan de tareas

<!-- Lista ordenada de tareas de implementación. Kiro las ejecutará en este orden. -->

- [ ] TAREA-001: 
- [ ] TAREA-002: 
- [ ] TAREA-003: 
- [ ] TAREA-004: Validar criterios de aceptación
- [ ] TAREA-005: Proponer mensaje de commit (hook commit-message)
- [ ] TAREA-006: Esperar aprobación del usuario para merge a develop

---

## 8. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| | | |

---

## 9. Notas adicionales

<!-- Decisiones de diseño, alternativas descartadas, referencias. -->

---

## Instrucción para Kiro

Cuando se inicie una feature:

1. Copiar este template y completar todas las secciones antes de escribir código
2. Guardar el SDD como `.kiro/specs/feature-[nombre].md`
3. Crear la rama: `git checkout -b feature/[nombre] develop`
4. Ejecutar las tareas del Plan en orden
5. Al finalizar cada tarea, marcarla como completada en este documento
6. Al terminar todas las tareas, ejecutar el hook `commit-message`
7. Presentar los cambios al usuario para validación
8. **No hacer merge a develop sin aprobación del usuario**
