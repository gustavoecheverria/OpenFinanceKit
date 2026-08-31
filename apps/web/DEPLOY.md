# OFK Web — Guía de Deploy (Vercel)

> ¿Configurando el entorno en un dispositivo nuevo? Ver [DEVELOPMENT.md](./DEVELOPMENT.md).

## Requisitos previos

- Cuenta en [Vercel](https://vercel.com) (gratis, Hobby plan)
- Repositorio en GitHub conectado
- Proyecto Supabase ya configurado (tablas + RLS aplicados)

## Configuración en Vercel

### 1. Importar el proyecto

1. En Vercel: **Add New → Project**
2. Importa el repositorio `OpenFinanceKit`
3. En **Root Directory**, selecciona `apps/web` (importante: es un monorepo)
4. Framework Preset: **Next.js** (se detecta automático)

### 2. Variables de entorno

En la sección **Environment Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |

> No agregues la service_role key aquí — solo se usa en tests locales.

### 3. Deploy

- Click **Deploy**
- Vercel construye y publica. Obtienes una URL tipo `https://openfinancekit.vercel.app`

### 4. Configurar Supabase Auth para producción

En Supabase → **Authentication → URL Configuration**:

- **Site URL:** la URL de Vercel (ej: `https://openfinancekit.vercel.app`)
- **Redirect URLs:** agrega `https://openfinancekit.vercel.app/auth/callback`

(Mantén también las URLs de `localhost:3000` para desarrollo.)

## CI/CD automático

Una vez conectado:

- Push a cualquier rama → **Preview Deployment** (URL temporal)
- Push a la rama de producción (`main` o la que configures) → **Production Deployment**

## Instalar como PWA

En el celular, abre la URL en el navegador:
- **Android (Chrome):** menú → "Agregar a pantalla de inicio"
- **iOS (Safari):** compartir → "Agregar a inicio"

La app se instala con ícono propio y se abre en modo standalone.
