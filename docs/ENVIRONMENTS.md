# OpenFinanceKit

**Documento:** Estrategia de Ambientes

**Versión:** 0.2.0

**Estado:** Vigente

**Última actualización:** 2026-08-27

---

## Resumen

OFK Web opera con tres ambientes (2 activos, 1 planeado). Todos comparten una
única base de datos Supabase; el aislamiento de datos entre usuarios lo garantiza
Row Level Security (RLS).

---

## Ambientes

| Ambiente | Rama | URL | Estado |
|----------|------|-----|--------|
| **Local** | cualquiera | `http://localhost:3000` | Activo |
| **UAT** | `develop` | `https://openfinancekit-uat.vercel.app` | Activo |
| **Producción** | `main` | `https://open-finance-kit.vercel.app` | Activo (vitrina) |
| *(Futuro)* | *(por definir)* | | Planeado |

### Local

Para desarrollo y pruebas en dispositivos de la red local.

```bash
cd apps/web
npm run dev
```

- Requiere `apps/web/.env.local` con las claves de Supabase.
- Accesible desde otros dispositivos de la red vía `http://<IP-de-tu-PC>:3000`.

### UAT

Ambiente de validación para QA. Corresponde a la rama `develop`.

- Cada push a `develop` genera un deploy en Vercel.
- Tiene un alias fijo (`openfinancekit-uat.vercel.app`) para URL estable.
- QA prueba aquí desde web o instalando la PWA.

### Producción

Vitrina para mostrar la app desplegada y recoger feedback. Corresponde a `main`.

- Solo se actualiza con releases aprobados (merge `develop` → `main`).
- Deploy automático de Vercel al hacer push a `main`.

---

## Flujo de promoción

```
feature/*  →  develop (UAT)  →  main (Producción)
```

1. Se desarrolla en `feature/*`
2. Merge a `develop` → se valida en UAT
3. Cuando UAT está OK → merge a `main` → producción

---

## Aislamiento de datos

- **Entre usuarios:** garantizado por RLS. Cada usuario solo ve sus propios datos.
- **Entre ambientes:** NO hay aislamiento — todos usan la misma base de datos.
- **Implicación:** un cambio de esquema (nueva tabla, columna) afecta a todos los
  ambientes. Coordinar las migraciones con cuidado.

> Cuando existan usuarios reales en producción, se creará un proyecto Supabase
> separado para producción (ver ADR-ENV-001).

---

## Configuración requerida

### Vercel

- **Production Branch:** `main`
- **Preview Deployments:** habilitados para todas las ramas
- **Alias de UAT:** asignar `openfinancekit-uat.vercel.app` al último deploy de `develop`
- **Variables de entorno** (Production y Preview):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_APP_ENV` (`local` | `uat` | `production`)

### Supabase (Authentication → URL Configuration)

Redirect URLs:
```
http://localhost:3000/**
https://openfinancekit-uat.vercel.app/**
https://open-finance-kit.vercel.app/**
```

---

## Notas

- El correo de auth usa el SMTP por defecto de Supabase (limitado). Para uso
  intensivo, configurar un proveedor propio (Resend, SendGrid).
- Este documento se revisará al incorporar el tercer ambiente.
