# OpenFinanceKit

**Documento:** SDD — feature/agentes-especializados

**Versión:** 0.1.0

**Estado:** Aprobado

**Sprint:** Sprint 1

**Rama:** feature/agentes-especializados

**Issue:** N/A

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-27

---

## 1. Resumen

Crear 3 agentes especializados (Developer, QA, Architect) que trabajan bajo un modelo SDD + looping de validación iterativa, y reconvertir el agente existente OFK Engineer en un coordinador/orquestador que dirige el flujo entre ellos.

---

## 2. Contexto y motivación

El agente actual (`OFK Engineer`) concentra los roles de Arquitecto, Desarrollador y QA en un solo steering file. Esto funciona para tareas simples, pero a medida que el proyecto crece (OFK Web, CI/CD, tests automatizados), se necesita separación de responsabilidades para:

- Obtener mejor calidad de código (Developer especializado)
- Tener un criterio de calidad independiente (QA no es quien desarrolla)
- Validar decisiones de arquitectura de forma explícita (Architect como gate)
- Implementar un ciclo de refinamiento iterativo (looping) que garantice cobertura del 100%

Si no se implementa: el agente seguirá siendo generalista y no habrá validación cruzada entre roles.

---

## 3. Objetivos

- [x] OBJ-001: Crear agente OFK Developer con rol de desarrollo full-stack
- [x] OBJ-002: Crear agente OFK QA con rol de testing y validación de entregas
- [x] OBJ-003: Crear agente OFK Architect con rol de arquitectura, CI/CD y modelo de negocio
- [x] OBJ-004: Reconvertir OFK Engineer en coordinador que orquesta el flujo entre los 3 agentes
- [x] OBJ-005: Definir el modelo de looping (Developer → QA → Architect → loop back si falla)

---

## 4. Fuera de alcance

- No incluye: Implementar código de la app (eso lo hará el Developer en futuras features)
- No incluye: Crear tests automatizados reales (eso lo hará QA cuando haya código)
- No incluye: Configurar GitHub Actions (eso lo revisará Architect en el Sprint 2+)
- No incluye: Cambios a la estructura de carpetas del proyecto

---

## 5. Diseño técnico

### 5.1 Archivos afectados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `.kiro/steering/agent-ofk-developer.md` | Crear | Agente de desarrollo |
| `.kiro/steering/agent-ofk-qa.md` | Crear | Agente de QA |
| `.kiro/steering/agent-ofk-architect.md` | Crear | Agente de arquitectura |
| `.kiro/steering/agent-ofk-engineer.md` | Modificar | Reconvertir en coordinador |
| `.kiro/specs/feature-agentes-especializados.md` | Crear | Este SDD |

### 5.2 Modelo de interacción entre agentes

```
┌────────────────── LOOP DE VALIDACIÓN ──────────────────┐
│                                                         │
│  1. Usuario solicita feature                           │
│  2. Coordinador (OFK Engineer) activa flujo SDD        │
│  3. Developer implementa tarea                         │
│  4. QA valida contra criterios de aceptación           │
│     └─ FAIL? → Developer corrige → volver a 4         │
│     └─ PASS? → continuar                              │
│  5. Architect revisa (cada fase o al final)            │
│     └─ OBSERVACIONES? → loop back a 3 o 4             │
│     └─ APPROVED? → continuar                          │
│  6. Siguiente tarea → volver a 3                       │
│  7. Todas completas → Coordinador entrega al usuario   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Jerarquía de agentes

```
OFK Engineer (Coordinador)
├── OFK Developer (implementación)
├── OFK QA (validación y testing)
└── OFK Architect (arquitectura y CI/CD)
```

### 5.4 Reglas de negocio aplicables

| RN | Descripción |
|----|-------------|
| RN-001 | Configuración es la única fuente de datos maestros |
| RN-002 | Motor es la única capa autorizada para cálculos |

Todos los agentes deben respetar las 6 reglas de negocio del MVP.

---

## 6. Criterios de aceptación

- [x] AC-001: Existe `.kiro/steering/agent-ofk-developer.md` con rol, proceso y restricciones claras
- [x] AC-002: Existe `.kiro/steering/agent-ofk-qa.md` con criterios de validación y generación de tests
- [x] AC-003: Existe `.kiro/steering/agent-ofk-architect.md` con revisión de arquitectura y CI/CD
- [x] AC-004: `agent-ofk-engineer.md` está reconvertido en coordinador que refiere a los 3 agentes
- [x] AC-005: El modelo de looping está documentado en el coordinador
- [x] AC-006: Los 4 archivos son consistentes entre sí (no se contradicen)
- [x] AC-007: Cada agente tiene sección de "Activación" clara (cuándo se usa)
- [x] AC-008: Cada agente tiene sección de "Output esperado" (qué entrega)

---

## 7. Plan de tareas

- [x] TAREA-001: Crear este SDD y guardarlo
- [x] TAREA-002: Crear rama feature/agentes-especializados
- [x] TAREA-003: Crear `.kiro/steering/agent-ofk-developer.md`
- [x] TAREA-004: Crear `.kiro/steering/agent-ofk-qa.md`
- [x] TAREA-005: Crear `.kiro/steering/agent-ofk-architect.md`
- [x] TAREA-006: Reconvertir `.kiro/steering/agent-ofk-engineer.md` en coordinador
- [x] TAREA-007: Validar consistencia entre los 4 archivos
- [x] TAREA-008: Presentar al usuario para aprobación
- [ ] TAREA-009: Proponer mensaje de commit (hook commit-message)
- [ ] TAREA-010: Esperar aprobación del usuario para merge a develop

---

## 8. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Agentes demasiado verbosos ralenticen el flujo | Medio | Outputs concisos y estructurados |
| Looping infinito si QA y Developer no convergen | Bajo | Máximo 3 iteraciones, luego escalar al usuario |
| Conflicto de instrucciones entre coordinador y agentes | Medio | Jerarquía clara: Coordinador > Agente específico |

---

## 9. Notas adicionales

- El agente OFK Engineer existente no se elimina — se enriquece como coordinador.
- Los steering files usan `inclusion: always` para estar disponibles en todo momento.
- En Kiro, los 3 agentes son "personalidades" del mismo modelo — se activan según contexto.
- El looping tiene un límite de 3 iteraciones para evitar ciclos infinitos.
