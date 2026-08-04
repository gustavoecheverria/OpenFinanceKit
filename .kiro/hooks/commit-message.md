---
name: Generador de mensaje de commit
description: Analiza los cambios staged y propone un mensaje de commit siguiendo Conventional Commits en español
trigger: pre-commit
---

# Hook — Generador de mensaje de commit

## Comportamiento

Cuando el usuario quiera hacer un commit, este hook debe:

1. Ejecutar `git diff --staged --stat` para ver los archivos modificados
2. Ejecutar `git diff --staged` para analizar el contenido de los cambios
3. Generar un mensaje de commit siguiendo el formato Conventional Commits
4. **Proponer** el mensaje al usuario para que lo apruebe o ajuste
5. Solo ejecutar el commit cuando el usuario confirme

## Formato del mensaje

```
tipo(alcance): descripción corta en español (máx 72 caracteres)

- Detalle 1
- Detalle 2
- Detalle 3

Refs: #número-de-issue (si aplica)
```

## Tipos válidos

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad o archivo nuevo |
| `fix` | Corrección de error |
| `docs` | Cambios en documentación |
| `refactor` | Reorganización sin cambio funcional |
| `style` | Formato, estilos visuales |
| `test` | Agregar o modificar pruebas |
| `chore` | Mantenimiento, dependencias, configuración |
| `build` | Cambios en scripts de construcción |

## Alcances válidos para OpenFinanceKit

| Alcance | Área |
|---------|------|
| `excel` | Archivos en product/excel/ |
| `docs` | Archivos en docs/ |
| `spec` | Archivos en .kiro/specs/ |
| `steering` | Archivos en .kiro/steering/ |
| `hooks` | Archivos en .kiro/hooks/ |
| `skills` | Archivos en .kiro/skills/ |
| `scripts` | Archivos en scripts/ |
| `config` | .kiro/mcp.json u otros archivos de configuración |
| `github` | .github/, workflows, issues |
| `notion` | Cambios reflejados en Notion |

## Reglas

- La descripción siempre en **español**
- Máximo 72 caracteres en la primera línea
- Si hay más de 3 archivos cambiados, agrupar por área en el cuerpo
- Si el cambio corresponde a una feature activa, agregar `Refs: #issue`
- Nunca hacer el commit sin confirmación del usuario

## Instrucción para Kiro

Cuando el usuario diga "quiero hacer commit", "genera el commit" o similar:

1. Ejecuta: `git -C {ruta_proyecto} diff --staged --stat`
2. Ejecuta: `git -C {ruta_proyecto} diff --staged`
3. Analiza los cambios y construye el mensaje siguiendo este formato
4. Presenta el mensaje propuesto con este bloque:

```
📝 Mensaje de commit propuesto:

─────────────────────────────────────────
tipo(alcance): descripción corta

- detalle 1
- detalle 2
─────────────────────────────────────────

¿Apruebas este mensaje, o quieres ajustarlo?
```

5. Espera confirmación antes de ejecutar `git commit -m "..."`
