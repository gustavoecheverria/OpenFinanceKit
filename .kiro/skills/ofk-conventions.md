---
inclusion: always
---

# Skills — Convenciones de OpenFinanceKit

## Encabezado estándar de documentos

Todo documento Markdown del proyecto debe comenzar con:

```markdown
# OpenFinanceKit

**Documento:** [Nombre del documento]
**Versión:** [X.Y.Z]
**Estado:** [Draft | Review | Aprobado]
**Sprint:** Sprint [N]
**Autor:** Gustavo Echeverría
**Última actualización:** [YYYY-MM-DD]

---
```

## Convenciones de nombres

### Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Documentos Markdown | UPPER_SNAKE_CASE | `BUSINESS_RULES.md` |
| Specs de features | kebab-case | `feature-excel-validaciones.md` |
| Scripts Python | snake_case | `procesar_ingresos.py` |
| Ramas git | kebab-case con prefijo | `feature/excel-motor` |

### Tablas de Excel

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Tablas | `tbl` + PascalCase | `tblIngresos` |
| Rangos nombrados | `rng` + PascalCase | `rngCategorias` |
| Celdas nombradas | `cel` + PascalCase | `celMesActual` |

### Campos en tablas

- PascalCase sin espacios ni caracteres especiales
- Sin tildes en nombres de campo
- Descriptivos y consistentes entre hojas

Correcto: `FechaVencimiento`, `CategoriaID`, `SaldoInicial`
Incorrecto: `fecha vencimiento`, `cat_id`, `saldo_inicial`

## Convenciones de commits

Formato: `tipo(alcance): descripción en español`

```
feat(excel): agregar validaciones a tblGastos
fix(motor): corregir fórmula de balance mensual
docs(spec): agregar SDD feature-dashboard-v2
chore(config): actualizar mcp.json con nuevo token
```

## Idioma

- Toda la documentación y commits: **español**
- Nombres de variables, funciones y campos: **inglés o español consistente**
- Comentarios en código: **español**

## Versionado semántico

```
v MAJOR . MINOR . PATCH
  │        │       └── Correcciones y mejoras menores
  │        └────────── Nuevas funcionalidades retrocompatibles
  └─────────────────── Cambios incompatibles en arquitectura
```

Versión actual: `v0.1.0`

## Reglas de negocio vigentes

Referencia rápida de las RN del MVP:

| ID | Regla |
|----|-------|
| RN-001 | Configuración es la única fuente de datos maestros |
| RN-002 | Motor es la única hoja autorizada para cálculos |
| RN-003 | Dashboard solo visualiza, nunca almacena |
| RN-004 | Hojas de captura (Ingresos, Gastos, Pagos) solo almacenan datos |
| RN-005 | Listas desplegables obtienen valores desde Configuración |
| RN-006 | Tablas permiten nuevas filas sin modificar fórmulas |

## Estructura de un SDD (Software Design Document)

Antes de implementar cualquier feature, Kiro debe completar el template en:
`.kiro/specs/feature-template.md`

Secciones obligatorias:
1. Resumen
2. Contexto y motivación
3. Objetivos
4. Fuera de alcance
5. Diseño técnico
6. Criterios de aceptación
7. Plan de tareas

**No se puede iniciar la implementación sin SDD aprobado.**
