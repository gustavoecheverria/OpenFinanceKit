# Roadmap - OpenFinanceKit

## Visión

Construir un Sistema de Gestión Financiera integral e inteligente (OpenFinanceKit) que permita a individuos y pequeñas empresas gestionar sus finanzas de forma centralizada, automatizada y con asistencia de inteligencia artificial. El objetivo a largo plazo es ofrecer una plataforma que integre control de ingresos y gastos, presupuestos, reportes financieros, y recomendaciones inteligentes basadas en el comportamiento del usuario.

### Objetivos Estratégicos

- Centralizar la gestión financiera en una sola plataforma
- Automatizar tareas repetitivas (categorización, alertas, reportes)
- Proveer insights financieros mediante inteligencia artificial
- Mantener una arquitectura escalable, modular y bien documentada
- Entregar valor incremental en cada sprint

---

## Sprints

### Sprint 1 — Arquitectura y Estructura del Proyecto

**Duración**: 2 semanas  
**Fase**: Arquitectura  
**Estado**: 🟢 En progreso

**Entregables**:
- Estructura de directorios del proyecto (`openfinancekit/`)
- Documentación base: README, CHANGELOG, ARCHITECTURE, BUSINESS_RULES, DATA_DICTIONARY, DECISIONS, ROADMAP
- Directorios reservados: `product/`, `qa/`, `backlog/`, `diagrams/`
- Configuración de GitHub: templates de issues, template de PR, directorio de workflows
- Definición del proceso de contribución

**Herramientas**: GitHub, Markdown, draw.io

---

### Sprint 2 — Decisiones Tecnológicas y Setup de Desarrollo

**Duración**: 2 semanas  
**Fase**: Arquitectura / Desarrollo  
**Estado**: ⬜ Planificado

**Entregables**:
- ADR: Selección de framework frontend (React, Vue, etc.)
- ADR: Selección de framework backend (Node.js, Python, etc.)
- ADR: Selección de base de datos (PostgreSQL, MongoDB, etc.)
- ADR: Estrategia de autenticación
- Configuración inicial del monorepo o estructura de código
- Setup de linting, formateo y pre-commit hooks
- Primer workflow de GitHub Actions (CI básico)
- Definición de estándares de código y convenciones

**Herramientas**: GitHub, GitHub Actions, Markdown

---

### Sprint 3 — Modelo de Datos y Backend Base

**Duración**: 2 semanas  
**Fase**: Desarrollo  
**Estado**: ⬜ Planificado

**Entregables**:
- Implementación del modelo de datos inicial (usuarios, cuentas, transacciones)
- API REST base con endpoints CRUD para entidades principales
- Configuración de base de datos y migraciones
- Seed de datos de prueba
- Tests unitarios para la capa de datos
- Documentación de API (OpenAPI/Swagger)

**Herramientas**: GitHub, GitHub Actions, framework backend seleccionado

---

### Sprint 4 — Autenticación y Frontend Base

**Duración**: 2 semanas  
**Fase**: Desarrollo  
**Estado**: ⬜ Planificado

**Entregables**:
- Sistema de autenticación (registro, login, sesiones)
- Estructura base del frontend (layout, navegación, rutas)
- Pantalla de login y registro
- Dashboard básico con datos placeholder
- Integración frontend-backend (cliente HTTP, manejo de tokens)
- Tests de integración para autenticación

**Herramientas**: GitHub, GitHub Actions, Figma Free (mockups)

---

### Sprint 5 — QA, Testing y DevOps

**Duración**: 2 semanas  
**Fase**: QA / DevOps  
**Estado**: ⬜ Planificado

**Entregables**:
- Estrategia de testing documentada (unitarios, integración, e2e)
- Configuración de framework de testing e2e
- Pipeline de CI/CD completo (build, test, deploy a staging)
- Configuración de entorno de staging
- Plan de pruebas para funcionalidades existentes
- Primeros casos de prueba ejecutados y documentados
- Métricas de cobertura de código

**Herramientas**: GitHub Actions, Notion (documentación QA)

---

### Sprint 6 — Funcionalidades Financieras Core

**Duración**: 2 semanas  
**Fase**: Desarrollo  
**Estado**: ⬜ Planificado

**Entregables**:
- CRUD completo de transacciones (ingresos y gastos)
- Categorización de transacciones
- Vista de balance y resumen financiero
- Filtros y búsqueda de transacciones
- Validaciones de reglas de negocio financieras
- Tests unitarios y de integración

**Herramientas**: GitHub, GitHub Actions

---

### Sprint 7 — Automatización e Inteligencia

**Duración**: 2 semanas  
**Fase**: Automatización  
**Estado**: ⬜ Planificado

**Entregables**:
- Categorización automática de transacciones con IA
- Alertas y notificaciones configurables
- Reportes financieros automáticos (mensual, semanal)
- Integración inicial con n8n para flujos automatizados
- Dashboard con gráficas y métricas en tiempo real

**Herramientas**: GitHub Actions, n8n, servicios de IA

---

## Dependencias

### Mapa de Dependencias entre Sprints

```
Sprint 1 ──→ Sprint 2 ──→ Sprint 3 ──→ Sprint 4
                │                           │
                └──────────→ Sprint 5 ──────┘
                                            │
                                            ▼
                                       Sprint 6 ──→ Sprint 7
```

### Detalle de Dependencias

| Sprint | Depende de | Razón |
|--------|-----------|-------|
| Sprint 2 | Sprint 1 | Necesita la estructura de documentación y repositorio establecida |
| Sprint 3 | Sprint 2 | Requiere decisiones tecnológicas tomadas (framework, BD) |
| Sprint 4 | Sprint 3 | Necesita el backend y modelo de datos implementados |
| Sprint 5 | Sprint 2, Sprint 4 | Requiere código existente para probar y pipeline base |
| Sprint 6 | Sprint 4 | Necesita autenticación y frontend base funcional |
| Sprint 7 | Sprint 6 | Requiere funcionalidades financieras core implementadas |

### Dependencias Externas

| Dependencia | Sprints afectados | Descripción |
|-------------|-------------------|-------------|
| GitHub | Todos | Hosting de repositorio y colaboración |
| GitHub Projects | Sprint 1+ | Gestión de backlog y sprints |
| GitHub Issues | Sprint 1+ | Tracking de tareas y bugs |
| GitHub Actions | Sprint 2+ | CI/CD y automatización |
| Figma Free | Sprint 4+ | Diseño de interfaces |
| draw.io | Sprint 1+ | Diagramas de arquitectura y flujos |
| Notion | Sprint 5+ | Documentación de QA |
| n8n | Sprint 7 | Automatización de flujos |
