---
inclusion: manual
---

# Herramienta — GitHub MCP

## Descripción

Integración con GitHub mediante el MCP oficial de GitHub. Permite operar sobre el repositorio OpenFinanceKit directamente desde Kiro sin abrir el navegador.

## Repositorio

`gustavoecheverria/OpenFinanceKit`

## Capacidades disponibles

| Operación | Descripción |
|-----------|-------------|
| `create_issue` | Crear un nuevo issue con título, body, labels y milestone |
| `update_issue` | Actualizar estado, labels o asignado de un issue |
| `list_issues` | Listar issues por estado, label o milestone |
| `create_pull_request` | Abrir un PR entre ramas |
| `merge_pull_request` | Fusionar un PR aprobado |
| `get_file_contents` | Leer el contenido de un archivo del repo |
| `push_files` | Subir uno o más archivos al repositorio |
| `create_branch` | Crear una nueva rama |
| `list_branches` | Listar ramas existentes |
| `add_issue_comment` | Agregar comentario a un issue |
| `create_release` | Crear un release con tag y notas |

## Configuración

Ver `mcp.json` en `.kiro/mcp.json`.

El token de autenticación se configura como variable de entorno:

```
GITHUB_TOKEN=ghp_...
```

## Reglas de uso

- **Nunca** hacer push o merge sin autorización del usuario
- Crear issues solo cuando el usuario lo solicite
- Al crear issues, asignar siempre: label de tipo, label de sprint y milestone correspondiente
- Los PRs siempre van de `feature/*` → `develop`, nunca directo a `main`

## Labels disponibles en el repositorio

**Tipo:** `bug` `enhancement` `documentation` `feature` `task` `spike`

**Estado:** `blocked` `ready` `review` `qa` `released`

**Complejidad:** `S` `M` `L` `XL`

**Sprint:** `Sprint-1` `Sprint-2` `Sprint-3`

**Épica:** `epic` `épica: infraestructura` `épica: excel-core` `épica: automatización` `épica: reportes`

## Milestones

| # | Nombre | Fecha |
|---|--------|-------|
| 1 | Sprint 1 — Architecture Freeze | 2026-08-17 |
| 2 | Sprint 2 — Financial Engine | 2026-08-31 |
| 3 | Sprint 3 — Dashboard | 2026-09-14 |
