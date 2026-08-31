# OFK Web — Guía de Setup en un Dispositivo Nuevo

Esta guía te lleva de un clon limpio del repositorio a la app corriendo en local.

---

## 1. Requisitos previos

Instala en el dispositivo nuevo:

| Herramienta | Versión mínima | Notas |
|-------------|----------------|-------|
| Node.js | 18+ (recomendado 20 LTS) | Para Next.js 15 |
| Git | cualquiera reciente | Control de versiones |
| Cuenta de acceso a Supabase | - | Para obtener las keys |

---

## 2. Configurar acceso a GitHub (SSH)

El repositorio usa SSH. En el dispositivo nuevo necesitas una SSH key registrada en GitHub.

### Generar la key

```bash
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"
```

Dale Enter a las 3 preguntas (ubicación por defecto, sin passphrase).

### Copiar la key pública

```bash
# Linux / macOS / WSL
cat ~/.ssh/id_ed25519.pub

# Windows (PowerShell)
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

### Registrarla en GitHub

1. GitHub → **Settings → SSH and GPG keys → New SSH key**
2. Title: nombre del dispositivo (ej. "Laptop-Casa")
3. Pega la key pública y guarda

### Verificar

```bash
ssh -T git@github.com
```

Debe responder: `Hi gustavoecheverria! You've successfully authenticated...`

---

## 3. Clonar el repositorio

```bash
git clone git@github.com:gustavoecheverria/OpenFinanceKit.git
cd OpenFinanceKit
git checkout develop
```

---

## 4. Instalar dependencias de la web app

```bash
cd apps/web
npm install
```

Instala también los navegadores de Playwright (para tests E2E):

```bash
npx playwright install
```

---

## 5. Configurar variables de entorno

El archivo `.env.local` **no está en el repositorio** (contiene secretos). Debes recrearlo.

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales reales de Supabase:

| Variable | Dónde obtenerla |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key |
| `NEXT_PUBLIC_APP_ENV` | `local` para desarrollo |

> ⚠️ Nunca commitees `.env.local`. Ya está en `.gitignore`.

Si vas a correr tests E2E que requieren service role, configura también `.env.test.local` a partir de `.env.test.local.example`.

---

## 6. Levantar la app en local

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

---

## 7. Comandos disponibles

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo (hot reload) |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Tests unitarios (Vitest, una corrida) |
| `npm run test:watch` | Tests unitarios en modo watch |
| `npm run test:e2e` | Tests E2E (Playwright) |

---

## 8. Configurar Supabase Auth para localhost

Si es un proyecto Supabase nuevo o no tiene localhost configurado:

Supabase → **Authentication → URL Configuration**:
- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** agrega `http://localhost:3000/auth/callback`

---

## 9. Flujo de trabajo con Git

Recuerda las reglas del proyecto:

- Trabaja en ramas `feature/*` desde `develop`
- Nunca subas a `main` sin autorización
- Nunca hagas push sin confirmar los cambios

```bash
git checkout -b feature/mi-cambio develop
# ... trabajar ...
git add <archivos>
git commit -m "tipo(alcance): descripción"
git push -u origin feature/mi-cambio
```

---

## Ver también

- [DEPLOY.md](./DEPLOY.md) — Guía de despliegue a Vercel
