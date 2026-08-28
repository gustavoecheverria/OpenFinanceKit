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

1. Kiro **nunca** hace commit sin antes pasar por el hook `commit-message`
2. El hook analiza `git diff --staged` y propone el mensaje
3. El usuario aprueba o ajusta el mensaje
4. Solo entonces se ejecuta el `git commit`

---

## Flujo para GitHub (Issues, Projects, Notion)

- **Issues:** Kiro puede crear issues si el usuario lo solicita. Nunca sin pedirlo.
- **GitHub Projects:** Kiro puede mover tarjetas si el usuario lo solicita.
- **Notion:** Kiro puede crear/editar páginas si el usuario lo solicita.
- **Push:** Solo con autorización explícita en cada caso.

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
