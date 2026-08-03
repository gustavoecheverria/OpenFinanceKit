# OpenFinanceKit

> Sistema modular de gestión financiera diseñado para evolucionar desde una hoja de cálculo hacia una plataforma profesional con automatización, reportes e inteligencia artificial.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-v0.1.0-blue)
![Sprint](https://img.shields.io/badge/sprint-1-purple)
![Visibilidad](https://img.shields.io/badge/visibilidad-privado-red)

---

## ¿Qué es OpenFinanceKit?

**OpenFinanceKit** es un sistema de gestión financiera modular y escalable diseñado para centralizar y automatizar operaciones financieras. La visión es construir una plataforma que integre control de ingresos y gastos, presupuestos, reportes financieros, y recomendaciones inteligentes basadas en el comportamiento del usuario.

El proyecto nace como un producto documentado en Markdown y Excel, con evolución progresiva hacia automatización en Python y una plataforma completa con asistencia de IA.

## Características Planeadas

- **Gestión de Transacciones** — Registro, categorización y seguimiento de ingresos y egresos
- **Presupuestos** — Creación y monitoreo de presupuestos por categoría y período
- **Reportes Financieros** — Dashboards y reportes automáticos
- **Automatización** — Scripts Python para procesamiento y alertas
- **Inteligencia Artificial** — Categorización automática y recomendaciones financieras
- **Multi-moneda** — Soporte para operaciones en múltiples monedas
- **Auditoría** — Registro completo de todas las operaciones

## Estructura del Proyecto

```
openfinancekit/
├── docs/                          # Documentación técnica
│   ├── architecture/              # Arquitectura del sistema
│   ├── decisions/                 # Registro de decisiones (ADR)
│   ├── changelog/                 # Historial de cambios
│   ├── roadmap/                   # Plan de desarrollo por sprints
│   ├── ARCHITECTURE.md            # Arquitectura general del sistema
│   ├── BUSINESS_RULES.md          # Reglas de negocio del dominio
│   └── DATA_DICTIONARY.md         # Modelo de datos y definiciones
├── product/                       # Artefactos del producto
│   ├── excel/                     # Archivos Excel del sistema financiero
│   └── templates/                 # Plantillas reutilizables
├── automation/                    # Automatización
│   ├── scripts/                   # Scripts Python
│   └── reports/                   # Reportes generados
├── backlog/                       # Gestión del backlog
├── qa/                            # Planes y casos de prueba
├── diagrams/                      # Diagramas de arquitectura y flujos
└── .github/                       # Configuración de GitHub
    ├── ISSUE_TEMPLATE/            # Plantillas de issues
    ├── PULL_REQUEST_TEMPLATE.md   # Template de Pull Request
    └── workflows/                 # GitHub Actions
```

## Versionado

Este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

| Componente | Significado |
|------------|-------------|
| `MAJOR` | Cambios incompatibles en arquitectura o modelo de datos |
| `MINOR` | Nuevas funcionalidades retrocompatibles |
| `PATCH` | Correcciones y mejoras menores |

Versión actual: **v0.1.0**

## Hoja de Ruta

El desarrollo se organiza por sprints incrementales. Consulta el plan completo en [docs/roadmap/ROADMAP.md](docs/roadmap/ROADMAP.md).

| Sprint | Fase | Estado |
|--------|------|--------|
| Sprint 1 | Arquitectura y estructura del proyecto | 🟢 En progreso |
| Sprint 2 | Decisiones tecnológicas y setup de desarrollo | ⬜ Planificado |
| Sprint 3 | Modelo de datos y backend base | ⬜ Planificado |
| Sprint 4 | Autenticación y frontend base | ⬜ Planificado |
| Sprint 5 | QA, Testing y DevOps | ⬜ Planificado |
| Sprint 6 | Funcionalidades financieras core | ⬜ Planificado |
| Sprint 7 | Automatización e inteligencia | ⬜ Planificado |

## Documentación Técnica

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](docs/architecture/ARCHITECTURE.md) | Componentes, capas y principios de diseño |
| [Reglas de Negocio](docs/BUSINESS_RULES.md) | Reglas y restricciones del dominio financiero |
| [Diccionario de Datos](docs/DATA_DICTIONARY.md) | Modelo de datos y definiciones de entidades |
| [Decisiones (ADR)](docs/decisions/DECISIONS.md) | Registro de decisiones arquitectónicas |
| [Roadmap](docs/roadmap/ROADMAP.md) | Plan de desarrollo por sprints |
| [Changelog](docs/changelog/CHANGELOG.md) | Historial de cambios por versión |

## Cómo Contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de enviar cambios.

### Convenciones rápidas

- Commits en español siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
- Ramas con prefijo: `feature/`, `fix/`, `docs/`, `release/`
- Documentación en español

## Tecnología

| Fase | Tecnología |
|------|-----------|
| Inicial | Markdown + Excel |
| Automatización | Python 3.x |
| Plataforma | Por definir en Sprint 2 |

## Licencia

Privado — todos los derechos reservados hasta versión estable.
