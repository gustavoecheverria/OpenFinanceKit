---
inclusion: manual
---

# Herramienta — Notion MCP

## Descripción

Integración con Notion mediante el MCP oficial (`@notionhq/notion-mcp-server`). Permite crear y editar páginas del workspace OpenFinanceKit directamente desde Kiro.

## Workspace

**Nombre:** OpenFinanceKit
**ID raíz:** `80db36de-12fe-434c-a9b4-657432cbefb8`
**URL:** https://www.notion.so

## Páginas del workspace

| Página | ID | Propósito |
|--------|----|-----------|
| 🏠 OpenFinanceKit (raíz) | `80db36de-12fe-434c-a9b4-657432cbefb8` | Portada y navegación |
| 📌 Roadmap | `3b19be3d-4b3f-817f-b066-d937f7e34f8c` | Sprints y planificación |
| 📚 Knowledge Base | `3b19be3d-4b3f-812c-891a-dfa981d1ceed` | Documentación y referencias |
| 💡 Ideas | `3b19be3d-4b3f-8112-ad9d-f1a88d5de73c` | Captura de ideas |
| 📅 Reuniones | `3b19be3d-4b3f-81df-9d53-f1205dd7f1ea` | Notas de reuniones |
| 🔍 Investigación | `3b19be3d-4b3f-8170-8544-fe239bb1e3e6` | Research y spikes |
| 📈 KPIs | `3b19be3d-4b3f-8128-8770-e5b2244f1346` | Métricas del proyecto |
| 📝 Notas | `3b19be3d-4b3f-8181-9ab2-e3924026a429` | Notas rápidas |

## Capacidades disponibles

| Operación | Descripción |
|-----------|-------------|
| `notion_retrieve_page` | Leer el contenido de una página |
| `notion_create_page` | Crear una nueva página |
| `notion_update_page` | Actualizar propiedades de una página |
| `notion_append_block_children` | Agregar contenido a una página |
| `notion_retrieve_block_children` | Leer los bloques de una página |
| `notion_search` | Buscar páginas por texto |
| `notion_create_database` | Crear una base de datos |
| `notion_query_database` | Consultar una base de datos |

## Configuración

Ver `mcp.json` en `.kiro/mcp.json`.

El token de autenticación se configura como variable de entorno:

```
NOTION_TOKEN=ntn_...
```

## Reglas de uso

- Notion es para **trabajo colaborativo**: ideas, notas, reuniones, investigación
- La documentación técnica oficial **siempre** vive en GitHub (`docs/`)
- No duplicar en Notion lo que ya existe en GitHub
- Al crear notas de reuniones, usar la plantilla de la página 📅 Reuniones
- Las ideas capturadas en Notion que maduran se convierten en issues de GitHub
