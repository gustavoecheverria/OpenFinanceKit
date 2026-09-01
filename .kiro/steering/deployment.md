---
inclusion: always
---

# Steering — Ambientes y Despliegue

## Estrategia de ambientes

OFK Web maneja dos ambientes desplegados, mapeados a ramas de Git.

| Ambiente | Rama | Rol | Se trabaja aquí |
|----------|------|-----|-----------------|
| **Producción** | `main` | Versión estable/base para pruebas | ❌ No — congelada |
| **UAT** | `develop` | Integración y mejoras | ✅ Sí — todo el trabajo nuevo |

### Regla operativa

- **Todas las mejoras y features nuevas se trabajan en `develop` (UAT).**
- `main` (Producción) solo recibe merges desde `develop` cuando el usuario autoriza un release.
- Nunca se trabaja directamente sobre `main`.
- `main` y `develop` divergen a propósito: `main` es la base estable, `develop` evoluciona.

---

## Configuración de Vercel

> ✅ **Los apuntamientos de Vercel ya están configurados** (confirmado por el usuario, 2026-08-28).
> No es necesario reconfigurar. Esta sección documenta el estado conocido.

- **Deploy automático activo:** cada push dispara un deploy en Vercel.
- **`main` → Producción** (URL de producción estable).
- **`develop` → UAT / Preview** (URL de pruebas).
- **Root Directory** en Vercel: `apps/web` (es un monorepo).
- Framework: Next.js (autodetectado).

### Variables de entorno (ya configuradas en Vercel)

| Variable | Ambiente |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Producción + UAT |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Producción + UAT |
| `NEXT_PUBLIC_APP_ENV` | `production` en main, `uat` en develop |

> La `service_role` key nunca va en Vercel — solo en tests locales.

### Supabase Auth

Las URLs de callback de producción y UAT ya están registradas en
Supabase → Authentication → URL Configuration.

---

## Flujo de release (develop → main)

Solo cuando el usuario autorice un release a producción:

```
1. Validar que develop (UAT) está estable y probado
2. git checkout main
3. git merge develop --no-ff
4. git push origin main   (Vercel despliega a Producción automáticamente)
5. git checkout develop   (volver a trabajar en UAT)
```

**Nunca** hacer este flujo sin autorización explícita del usuario.

---

## Referencias

- `apps/web/DEPLOY.md` — Guía detallada de deploy a Vercel
- `apps/web/DEVELOPMENT.md` — Setup de entorno en dispositivo nuevo
- `.kiro/steering/workflow.md` — Reglas de ramas y push
