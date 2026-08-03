# OpenFinanceKit

**Documento:** README

**Versión:** 0.1.0

**Estado:** Draft

**Sprint:** Sprint 1

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-03

---

> Plataforma modular de gestión financiera diseñada para ayudar a personas y organizaciones a administrar sus finanzas mediante una arquitectura escalable, comenzando con Excel y evolucionando hacia un ecosistema de herramientas profesionales.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-v0.1.0-blue)
![Sprint](https://img.shields.io/badge/sprint-1-purple)
![Visibilidad](https://img.shields.io/badge/visibilidad-privado-red)

---

## ¿Qué es OpenFinanceKit?

**OpenFinanceKit (OFK)** es un framework de gestión financiera modular y escalable. No es solo un Excel para llevar finanzas — es una arquitectura que comienza con Excel como primera implementación y evoluciona hacia una plataforma completa.

## Ecosistema OFK

```
OpenFinanceKit (OFK)
│
├── OFK Excel          ← Implementación actual (v0.1.x)
├── OFK Web            ← Interfaz web (futuro)
├── OFK Mobile         ← Aplicación móvil (futuro)
├── OFK API            ← API REST/GraphQL (futuro)
├── OFK Power BI       ← Dashboards avanzados (futuro)
├── OFK AI Assistant   ← Asistente con inteligencia artificial (futuro)
└── OFK Automation     ← Flujos automatizados con n8n (futuro)
```

Todos los módulos comparten las mismas reglas de negocio documentadas en `docs/BUSINESS_RULES.md`.

## Estructura del proyecto

```
OpenFinanceKit/
├── PROJECT_CHARTER.md         ← Visión, misión, acrónimo y ecosistema
├── README.md                  ← Este archivo
├── CONTRIBUTING.md            ← Guía de contribución
├── CHANGELOG.md               ← No aplica — ver docs/changelog/
├── docs/                      ← Documentación técnica oficial
│   ├── architecture/          ← Arquitectura del sistema
│   ├── decisions/             ← Decisiones arquitectónicas (ADR)
│   ├── changelog/             ← Historial de versiones
│   ├── roadmap/               ← Plan de desarrollo por sprints
│   ├── BUSINESS_RULES.md      ← Reglas de negocio del dominio
│   └── DATA_DICTIONARY.md     ← Modelo de datos y entidades
├── product/                   ← Artefactos del producto
│   ├── excel/                 ← OFK Excel (implementación actual)
│   └── templates/             ← Plantillas reutilizables
├── scripts/                   ← Scripts de automatización (Python)
├── backlog/                   ← Gestión del backlog local
├── qa/                        ← Planes y casos de prueba
├── diagrams/                  ← Diagramas de arquitectura y flujos
└── .github/                   ← Configuración de GitHub
    ├── ISSUE_TEMPLATE/        ← Plantillas de issues
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/             ← GitHub Actions
```

## Versionado

Seguimos [Semantic Versioning](https://semver.org/lang/es/) desde `v0.1.0`.

| Componente | Significado |
|------------|-------------|
| `MAJOR` | Cambios incompatibles en arquitectura o modelo de datos |
| `MINOR` | Nuevas funcionalidades retrocompatibles |
| `PATCH` | Correcciones y mejoras menores |

## Documentación técnica

| Documento | Descripción |
|-----------|-------------|
| [Project Charter](PROJECT_CHARTER.md) | Visión, misión, ecosistema OFK |
| [Arquitectura](docs/architecture/ARCHITECTURE.md) | Componentes, capas y principios |
| [Reglas de Negocio](docs/BUSINESS_RULES.md) | Reglas del dominio financiero |
| [Diccionario de Datos](docs/DATA_DICTIONARY.md) | Modelo de datos y entidades |
| [Decisiones (ADR)](docs/decisions/DECISIONS.md) | Registro de decisiones arquitectónicas |
| [Roadmap](docs/roadmap/ROADMAP.md) | Plan de desarrollo por sprints |
| [Changelog](docs/changelog/CHANGELOG.md) | Historial de cambios por versión |

## Cómo contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de enviar cambios.

## Licencia

MIT — ver [LICENSE](./LICENSE)
