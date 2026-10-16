---
inclusion: always
---

# Steering — Flujo de trabajo

## Regla principal

**Nunca subir cambios a GitHub sin autorización explícita del usuario.**

Kiro crea, modifica y valida localmente. El usuario decide cuándo y qué se sube.

---

## Estrategia de ramas

```
main        ← Solo releases aprobados por el usuario
│
└── develop ← Integración. Lo que está listo para validar.
    │
    └── feature/nombre ← Trabajo activo de cada funcionalidad
```

### Reglas por rama

| Rama | Quién puede tocarla | Cuándo |
|------|-------------------|--------|
| `main` | Solo con autorización explícita del usuario | Al cerrar un sprint o milestone |
| `develop` | Kiro, tras aprobación del usuario | Cuando el usuario aprueba la feature |
| `feature/*` | Kiro libremente | Durante el desarrollo |

---

## Flujo para cada feature

```
 1. Usuario solicita feature
        ↓
 2. Kiro completa el SDD (.kiro/specs/feature-nombre.md)
        ↓
 3. Usuario aprueba el SDD
        ↓
 4. Kiro crea rama: git checkout -b feature/nombre develop
        ↓
 5. Kiro ejecuta las tareas del SDD en orden
        ↓
 6. Kiro SINCRONIZA LA DOCUMENTACIÓN  ← paso obligatorio, ver abajo
        ↓
 7. Kiro presenta resultado al usuario para validación
        ↓
 8. Usuario aprueba
        ↓
 9. Hook commit-message genera el mensaje → usuario aprueba
        ↓
10. Kiro hace el commit en feature/  (código + docs en el MISMO commit)
        ↓
11. Usuario autoriza merge a develop
        ↓
12. Usuario autoriza (cuando quiera) merge develop → main
```

---

## Paso obligatorio: sincronizar la documentación

**Actualizar la documentación no es un extra. Es parte del cambio.**

La documentación de este repo se cayó en desuso varias veces porque el código avanzaba
y los documentos no. Un colaborador nuevo leía un README que prometía una tabla `pagos`
que ya no existía, o un changelog congelado en v0.1.0. Eso se corrige con una regla
simple: **si el código cambió, el documento que lo describe cambia en el mismo commit.**

### Qué actualizar según qué cambió

| Cambiaste… | Actualiza también |
|------------|-------------------|
| Una tabla, columna o restricción | `docs/DATA_DICTIONARY.md` y `apps/web/supabase/migrations/README.md` |
| Una regla del dominio o del Motor | `docs/BUSINESS_RULES.md` |
| Un módulo, una ruta o una pantalla | `docs/PROJECT_STATUS.md` y `README.md` |
| El comportamiento de una feature | El SDD en `.kiro/specs/` (marca los checkboxes que se cumplieron) |
| Una dependencia del stack | `README.md` y `.kiro/steering/project.md` |
| Una versión o un release | `docs/changelog/CHANGELOG.md`, `package.json` y el tag de git |

### Al agregar una migración

Además de lo de arriba, todo archivo SQL nuevo lleva en su encabezado:

```sql
-- OpenFinanceKit — Migración NNN
-- Release: vX.Y.Z (pendiente)
-- Fecha: YYYY-MM-DD
-- Descripción: Qué hace y por qué
```

Y se agrega a la tabla de estado de `apps/web/supabase/migrations/README.md`.

### Al cerrar un SDD

- Marca `[x]` en **todos** los objetivos y criterios que se cumplieron. Un spec con 62
  checks marcados y 6 sin revisar no dice nada
- Si el feature se canceló, márcalo explícitamente como **CANCELADO** con la razón. No
  lo dejes en "En Desarrollo": eso hace que alguien lo retome sin saber que ya no aplica
- Cambia `**Estado:**` a `Completado` o `Cancelado`

### Al cerrar un release

- `develop → main`
- `git tag vX.Y.Z`
- `docs/changelog/CHANGELOG.md`: mueve la sección de pendiente a fechada
- `docs/PROJECT_STATUS.md`: actualiza la tabla de ambientes y la de módulos
- `README.md`: la versión

---

## Checklist antes de cualquier push

- [ ] ¿El usuario autorizó explícitamente este push?
- [ ] ¿Los cambios están en la rama correcta?
- [ ] ¿El mensaje de commit fue aprobado por el usuario?
- [ ] ¿Los criterios de aceptación del SDD están cumplidos?
- [ ] **¿La documentación afectada está actualizada en el mismo commit?**
- [ ] **¿Los checkboxes del SDD reflejan lo que realmente se hizo?**

## Flujo para commits

1. Kiro **SIEMPRE** pregunta al usuario antes de hacer cualquier commit
2. El usuario valida localmente los cambios (probar en local, revisar código)
3. Solo después de validación, el usuario autoriza explícitamente: "apruebo"
4. Kiro hace `git add` de los archivos correspondientes
5. Kiro ejecuta el hook `commit-message` (genera el mensaje automático)
6. Kiro presenta el mensaje al usuario para aprobación
7. Usuario aprueba el mensaje: "OK el commit"
8. Solo entonces Kiro ejecuta `git commit`
9. **NO SE HACE PUSH SIN AUTORIZACIÓN EXPLÍCITA**

### Regla de Oro

```
NUNCA hacer commit o push sin validación y autorización previa del usuario.
Ni siquiera si es "obvio" que está bien.
Ni siquiera si "ya pasó QA".
SIEMPRE esperar explícitamente: "apruebo" o "OK"
```

---

## Flujo para GitHub (Issues, Projects, Notion)

- **Issues:** Kiro puede crear issues si el usuario lo solicita. Nunca sin pedirlo.
- **GitHub Projects:** Kiro puede mover tarjetas si el usuario lo solicita.
- **Notion:** Kiro puede crear/editar páginas si el usuario lo solicita.
- **Push a origin:** **PROHIBIDO sin autorización explícita del usuario en CADA PUSH**
  - Antes de cualquier push (develop, main, feature): "¿Autorizo push?"
  - Usuario responde: "sí apruebo" o "no, haz X primero"
  - Solo entonces: `git push`

### Secuencia correcta

```
Kiro: Cambios listos en feature/X. ¿Validas en local y autorizas el commit?
Usuario: [valida en local] Apruebo
Kiro: [hace commit]
Kiro: ¿Autorizas merge a develop?
Usuario: Sí, merge
Kiro: [hace merge]
Kiro: ¿Autorizas push a origin/develop?
Usuario: Sí, push
Kiro: [push]
```

---

## Nomenclatura de ramas

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Feature | `feature/descripcion-corta` | `feature/excel-validaciones` |
| Fix | `fix/descripcion-corta` | `fix/motor-formula-balance` |
| Docs | `docs/descripcion-corta` | `docs/adr-003-python` |
| Release | `release/vX.Y.Z` | `release/v0.2.0` |
