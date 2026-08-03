# Guía de Contribución — FinanceOS

## Flujo de trabajo

Este proyecto usa un flujo Scrum ampliado con las siguientes etapas:

```
Ideas → Backlog → Ready → In Progress → Review → QA → Done → Released
```

## Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Código estable, solo merges aprobados |
| `develop` | Integración continua |
| `feature/nombre` | Nueva funcionalidad |
| `fix/nombre` | Corrección de bugs |
| `docs/nombre` | Cambios en documentación |
| `release/vX.Y.Z` | Preparación de release |

## Cómo crear un issue

1. Usa las plantillas disponibles en `.github/ISSUE_TEMPLATE/`
2. Asigna la épica correspondiente mediante label
3. Estima el esfuerzo antes de mover a `Ready`

## Cómo enviar cambios

1. Crea una rama desde `develop`
2. Haz commits con mensajes descriptivos en español siguiendo Conventional Commits
3. Abre un Pull Request usando el template en `.github/PULL_REQUEST_TEMPLATE.md`
4. El PR debe pasar Review y QA antes de mergearse a `main`

## Formato de commits

```
tipo(alcance): descripción corta en español

Tipos válidos:
  feat      Nueva funcionalidad
  fix       Corrección de error
  docs      Cambios en documentación
  refactor  Refactorización sin cambio funcional
  test      Agregar o modificar tests
  chore     Tareas de mantenimiento

Ejemplos:
  feat(excel): agregar módulo de flujo de caja
  fix(docs): corregir enlace en README
  docs(roadmap): actualizar hoja de ruta v0.2.0
```

## Versionado

Seguimos [Semantic Versioning](https://semver.org/lang/es/) desde `v0.1.0`.

## Convenciones

- Todo el código y documentación **en español**
- Sin eliminación física de registros financieros (solo marcado como inactivo)
- Toda decisión técnica importante se registra como ADR en `docs/decisions/DECISIONS.md`
