---
inclusion: always
---

# Steering — Contexto del proyecto

## Identidad del proyecto

- **Nombre:** OpenFinanceKit
- **Acrónimo:** OFK
- **Versión actual:** v0.1.0
- **Sprint activo:** Sprint 1 — Architecture Freeze
- **Repositorio:** https://github.com/gustavoecheverria/OpenFinanceKit
- **Rama estable:** `main`
- **Rama de integración:** `develop`

## Qué es OpenFinanceKit

OpenFinanceKit es un framework de gestión financiera modular. No es solo un Excel — es una arquitectura que comienza con Excel como primera implementación (OFK Excel) y evoluciona hacia un ecosistema completo.

## Ecosistema OFK

```
OpenFinanceKit
├── OFK Excel        ← Implementación actual
├── OFK Web          ← Futuro
├── OFK Mobile       ← Futuro
├── OFK API          ← Futuro
├── OFK Power BI     ← Futuro
├── OFK AI Assistant ← Futuro
└── OFK Automation   ← Futuro (Sprint 7+)
```

## Estructura del repositorio

```
OpenFinanceKit/
├── .kiro/               ← Configuración de Kiro
├── docs/                ← Documentación técnica oficial
│   ├── architecture/
│   ├── decisions/
│   ├── changelog/
│   ├── roadmap/
│   ├── PROJECT_SPECIFICATION.md
│   ├── BUSINESS_RULES.md
│   └── DATA_DICTIONARY.md
├── product/excel/       ← OFK Excel (OpenFinanceKit.xlsx)
├── scripts/             ← Automatización Python (futuro)
├── backlog/
├── qa/
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
| Automatizaciones | n8n (Fase 3) |

## Personas

- **Autor / Product Owner:** Gustavo Echeverria
- **Agente IA:** Kiro

## Principios del proyecto

1. Documentation-first
2. Fuente única de verdad
3. Versionado semántico desde v0.1.0
4. Modularidad — cada módulo OFK es independiente
5. Buenas prácticas de ingeniería desde el día uno
6. Simplicidad antes que complejidad
