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
6. Kiro presenta resultado al usuario para validación
        ↓
7. Usuario aprueba
        ↓
8. Hook commit-message genera el mensaje → usuario aprueba
        ↓
9. Kiro hace el commit en feature/
        ↓
10. Usuario autoriza merge a develop
        ↓
11. Usuario autoriza (cuando quiera) merge develop → main
```

---

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
Kiro: Cambios listos en feature/X. ¿Validás en local y autorizás el commit?
Usuario: [valida en local] Apruebo
Kiro: [hace commit]
Kiro: ¿Autorizás merge a develop?
Usuario: Sí, merge
Kiro: [hace merge]
Kiro: ¿Autorizás push a origin/develop?
Usuario: Sí, pushea
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

---

## Checklist antes de cualquier push

- [ ] ¿El usuario autorizó explícitamente este push?
- [ ] ¿Los cambios están en la rama correcta?
- [ ] ¿El mensaje de commit fue aprobado por el usuario?
- [ ] ¿Los criterios de aceptación del SDD están cumplidos?
