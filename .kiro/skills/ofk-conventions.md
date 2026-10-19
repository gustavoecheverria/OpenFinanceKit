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

### Tuteo en los textos de la interfaz

Los textos que ve el usuario (labels, mensajes de error, guías, estados vacíos) usan
**imperativo de tuteo, sin voseo**.

| Correcto | Incorrecto |
|----------|------------|
| Crea una categoría | Creá una categoría |
| Necesitas una cuenta | Necesitás una cuenta |
| Selecciona el destino | Elegí primero el origen |
| Registra tu primer gasto | Registrá tu primer gasto |
| Vuelve a iniciar sesión | Volvé a iniciar sesión |

Razón: la base del proyecto ya usa tuteo en todos sus textos
("Vuelve a iniciar sesión", "Completa el concepto", "Selecciona una cuenta"). El voseo
introducido en un módulo nuevo rompe la consistencia y hace que la app parezca escrita
por dos personas distintas.

Aplica a todo texto visible. Los comentarios de código pueden usar la forma que sea más
clara, pero se recomienda la misma.

**Cómo verificarlo antes de commitear:**

```bash
# No debería devolver nada.
# -i para no perder las formas en minúscula (tenés, marcás, pagás).
# \b al final para no confundir "creá" dentro de "creándola", que es correcto.
grep -rniE '\b(creá|registrá|desactivá|necesitás|elegí|marcá|mové|guardá|revisá|buscá|ingresá|pagás|tenés|podés|hacé|tocá|poné|usá|ajustá|salí|transferí|arrancá|reactivá|retirás|registrás|marcás|pedís|querés|sabés|dejás|entrás|seguís|creás|elegís|reactivás)\b' apps/web/src/
```

## Versionado semántico

```
v MAJOR . MINOR . PATCH
  │        │       └── Correcciones y mejoras menores
  │        └────────── Nuevas funcionalidades retrocompatibles
  └─────────────────── Cambios incompatibles en arquitectura
```

| | Versión | Rama |
|---|---------|------|
| Última publicada | `v0.3.0` | `main` |
| En desarrollo | `v0.3.x` | `develop` |
| Tags existentes | `v0.1.0`, `v0.2.0`, `v0.3.0` | — |

> `v0.2.0` se había liberado sin tag; se recuperó al liberar v0.3.0 el 2026-10-17.

### Regla de las cabeceras de migración

El campo `Release:` de una migración dice **en qué versión se publica**, no que ya se
haya publicado:

```sql
-- Release: v0.4.0 (pendiente)    ← está en develop, no en producción
-- Release: v0.3.0                ← ya está en main
```

Nunca se inventa un número de versión. Si no se sabe en qué release va un cambio, se
documenta como tal en vez de ponerle un número.

## Documentación siempre al día

**Si el código cambia, el documento que lo describe cambia en el mismo commit.** No es un
extra ni un "después me encargo".

| Cambiaste… | Actualiza también |
|------------|-------------------|
| Una tabla, columna o restricción | `docs/DATA_DICTIONARY.md` + `apps/web/supabase/migrations/README.md` |
| Una regla del dominio | `docs/BUSINESS_RULES.md` |
| Un módulo o una ruta | `docs/PROJECT_STATUS.md` + `README.md` |
| El comportamiento de una feature | El SDD, marcando los checkboxes cumplidos |
| El stack | `README.md` + `.kiro/steering/project.md` |
| Una versión | `docs/changelog/CHANGELOG.md` + `package.json` + tag de git |

> **Si el código y la documentación se contradicen, el código gana.** Y entonces hay que
> arreglar la documentación en el mismo commit.

Ver el detalle en `.kiro/steering/workflow.md`.

## Reglas de negocio vigentes

Referencia rápida. El detalle está en `docs/BUSINESS_RULES.md`.

| ID | Regla |
|----|-------|
| RN-001 | Configuración es la única fuente de datos maestros |
| RN-002 | El Motor es el único lugar donde hay cálculos |
| RN-003 | El Dashboard solo visualiza, nunca almacena |
| RN-004 | Las pantallas de captura solo almacenan datos |
| RN-005 | Las listas desplegables obtienen sus valores desde Configuración |
| RN-006 | Las tablas admiten nuevas filas sin cambiar fórmulas ni código |

Módulos con reglas propias:

| Prefijo | Módulo |
|---------|--------|
| `RN-CUE-*` | Cuentas |
| `RN-CAT-*` | Categorías |
| `RN-MOV-*` | Ingresos y gastos |
| `RN-TRANS-*` | Transferencias entre cuentas |
| `RN-PAG-*` | Pagos programados (plantillas) |
| `RN-REC-*` | Recurrencias |
| `RN-EST-*` | Estados calculados |
| `RN-BAJ-*` | Baja y desactivación |
| `RN-UI-*` | Reglas de interfaz |

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
