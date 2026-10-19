---
inclusion: always
---

# Steering — Contexto del proyecto

## Identidad del proyecto

- **Nombre:** OpenFinanceKit
- **Acrónimo:** OFK
- **Versión publicada:** v0.3.0 (en `main`)
- **Versión en desarrollo:** v0.3.x (en `develop`, sin release abierto)
- **Rama activa:** develop (integración)
- **Repositorio:** https://github.com/gustavoecheverria/OpenFinanceKit
- **Rama estable:** `main`
- **Rama de integración:** `develop`

## Qué es OpenFinanceKit

OpenFinanceKit es un framework de gestión financiera modular. No es solo un Excel — es una
arquitectura que comenzó con Excel como primera implementación (OFK Excel) y evoluciona
hacia un ecosistema completo.

**Hoy es un gestor de finanzas personales**, no un ERP. Para el alcance exacto, ver el
anexo de `docs/BUSINESS_RULES.md`.

## Ecosistema OFK

```
OpenFinanceKit
├── OFK Excel        ← Referencia histórica (product/excel/)
├── OFK Web          ← Implementación activa. Next.js 15 + Supabase, app PWA
├── OFK Mobile       ← Futuro
├── OFK API          ← Futuro
├── OFK Power BI     ← Futuro
├── OFK AI Assistant ← Futuro
└── OFK Automation   ← Futuro
```

## Estado actual (2026-10-19)

| | Versión | Rama | Estado |
|---|---------|------|--------|
| Producción | v0.3.0 | `main` | 🟢 Estable desde 2026-10-17 |
| UAT | v0.3.0 | `develop` | 🟢 Al día con producción |

**Siguiente paso del proyecto:** cerrar AC-018 (aislamiento RLS con dos usuarios) y montar CI.

Fuente de verdad para el estado: **`docs/PROJECT_STATUS.md`**. Si este archivo de
steering discrepa de ese documento, manda `PROJECT_STATUS.md`.

## Estructura del repositorio

```
OpenFinanceKit/
├── .kiro/               ← Configuración de Kiro (steering, specs, hooks, skills)
├── apps/web/            ← La aplicación
├── docs/                ← Documentación técnica oficial
│   ├── PROJECT_STATUS.md   ← Estado real (leer primero)
│   ├── architecture/
│   ├── decisions/
│   ├── changelog/
│   ├── roadmap/
│   ├── qa/istqb/
│   ├── BUSINESS_RULES.md
│   └── DATA_DICTIONARY.md
├── product/excel/       ← OFK Excel (referencia histórica)
├── scripts/             ← Automatización Python
├── backlog/             ← Vacío por diseño: el backlog vive en GitHub Projects
├── qa/                  ← Evidencia y reportes de pruebas
├── diagrams/
└── .github/
```

## Herramientas del ecosistema

| Tipo de información | Herramienta oficial |
|---------------------|-------------------|
| Código y Excel | GitHub |
| Documentación técnica | GitHub (docs/) |
| Diagramas técnicos | Mermaid en Markdown |
| Gestión del trabajo | GitHub Projects |
| Historias y bugs | GitHub Issues |
| Releases | GitHub Releases |
| Investigación e ideas | Notion |
| Notas de reuniones | Notion |
| Automatizaciones | n8n (futuro) |

## Personas

- **Autor / Product Owner:** Gustavo Echeverría
- **Agente IA:** Kiro

## Principios del proyecto

1. Documentation-first
2. Fuente única de verdad
3. Versionado semántico desde v0.1.0
4. **Documentación siempre al día** — actualizar la documentación es parte del cambio
5. Modularidad — cada módulo OFK es independiente
6. Buenas prácticas de ingeniería desde el día uno
7. Simplicidad antes que complejidad
