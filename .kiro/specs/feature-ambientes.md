# OpenFinanceKit

**Documento:** SDD — feature/ambientes

**Versión:** 0.2.0

**Estado:** Draft

**Sprint:** Sprint 2

**Rama:** feature/ambientes

**Issue:** N/A

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-27

---

## 1. Resumen

Definir y documentar la estrategia de ambientes de OFK Web: Local, UAT y Producción. Por ahora se implementan 2 (UAT y Producción); Local ya existe. Todos comparten una única base de datos Supabase, con aislamiento de datos por usuario vía RLS.

---

## 2. Contexto y motivación

El proyecto necesita separar el trabajo de desarrollo/QA de la vitrina de producción. Hoy hay 2 usuarios trabajando sobre la app y producción es solo demostrativa (mostrar que se desplegó). No se requiere aún aislamiento de datos entre ambientes — el aislamiento relevante (entre usuarios) ya lo garantiza RLS.

Si no se implementa: no hay una URL estable de UAT para que QA pruebe, ni documentación de qué rama corresponde a qué ambiente.

---

## 3. Objetivos

- [ ] OBJ-001: UAT accesible desde una URL fija (rama `develop` en Vercel)
- [ ] OBJ-002: Producción estable (rama `main`, ya existe)
- [ ] OBJ-003: Local documentado para pruebas en dispositivos de la red
- [ ] OBJ-004: Documentación clara de la estrategia de ambientes
- [ ] OBJ-005: Redirect URLs de Supabase configuradas para todos los ambientes

---

## 4. Fuera de alcance

- No incluye: bases de datos separadas por ambiente (se usa una sola)
- No incluye: el tercer ambiente (se implementará después)
- No incluye: SMTP propio / proveedor de correo (tema aparte)
- No incluye: dominios personalizados propios (se usan los de vercel.app)

---

## 5. Diseño técnico

### 5.1 Mapa de ambientes

| Ambiente | Rama | URL | Supabase | Uso |
|----------|------|-----|----------|-----|
| Local | cualquiera | `http://localhost:3000` | Compartido | Desarrollo y pruebas en red local |
| UAT | `develop` | `openfinancekit-uat.vercel.app` (alias fijo) | Compartido | QA prueba desde web/PWA |
| Producción | `main` | `open-finance-kit.vercel.app` | Compartido | Vitrina / feedback |

### 5.2 Aislamiento de datos

- **Entre usuarios:** garantizado por RLS (`auth.uid() = user_id`) en todas las tablas.
- **Entre ambientes:** NO hay aislamiento (misma DB). Aceptable en esta fase.
- **Precaución:** un cambio de esquema en UAT afecta a Producción (comparten DB).

### 5.3 Configuración en Vercel

- **Production Branch:** `main` (ya configurado)
- **Preview Deployments:** todas las ramas (automático). `develop` recibe un dominio/alias fijo para UAT.
- Variables de entorno `NEXT_PUBLIC_SUPABASE_*` ya configuradas (Production and Preview).

### 5.4 Configuración en Supabase (Auth → URL Configuration)

Redirect URLs a incluir:
- `http://localhost:3000/**` (Local)
- `https://open-finance-kit.vercel.app/**` (Producción)
- `https://openfinancekit-uat.vercel.app/**` (UAT — alias de develop)

### 5.5 Variable de identificación de ambiente (opcional)

Se puede exponer `NEXT_PUBLIC_APP_ENV` (local | uat | production) para mostrar un badge del ambiente en la UI, útil para que QA sepa dónde está parado.

---

## 6. Criterios de aceptación

- [ ] AC-001: `develop` tiene una URL de UAT fija y accesible
- [ ] AC-002: El login funciona en UAT (redirect URL configurada)
- [ ] AC-003: Producción sigue funcionando sin cambios
- [ ] AC-004: Existe documentación de ambientes en el repo
- [ ] AC-005: (Opcional) La UI muestra en qué ambiente se está (badge)

---

## 7. Plan de tareas

- [ ] TAREA-001: Documentar estrategia de ambientes (docs/ENVIRONMENTS.md)
- [ ] TAREA-002: (Opcional) Badge de ambiente con NEXT_PUBLIC_APP_ENV
- [ ] TAREA-003: [Usuario] Asignar alias/dominio fijo a develop en Vercel
- [ ] TAREA-004: [Usuario] Agregar Redirect URLs de UAT en Supabase
- [ ] TAREA-005: Validar login en UAT y que producción sigue OK
- [ ] TAREA-006: Hook commit-message + merge a develop

---

## 8. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Cambio de esquema en UAT afecta producción | Medio | Coordinar migraciones; separar DB cuando haya usuarios reales |
| Datos de prueba mezclados con demo de producción | Bajo | RLS aísla por usuario; prod es solo vitrina |
| Free tier de Supabase se pausa por inactividad | Bajo | Uso regular de UAT lo mantiene activo |

---

## 9. Decisiones de arquitectura

### ADR-ENV-001: Una sola base de datos para todos los ambientes (por ahora)

Con 2 usuarios y producción solo demostrativa, el aislamiento entre ambientes no aporta valor suficiente para justificar consumir 2 de los 2 proyectos del free tier. RLS ya aísla a los usuarios entre sí. Cuando existan usuarios reales en producción, se creará un proyecto Supabase separado para producción (aislamiento real) — cambio de bajo esfuerzo (solo variables de entorno).

### ADR-ENV-002: UAT = rama develop con alias fijo en Vercel

En vez de crear infraestructura separada para UAT, se aprovecha el sistema de Preview Deployments de Vercel asignando un alias estable a `develop`. Cero costo, cero mantenimiento adicional.

---

## 10. Notas adicionales

- El flujo de ramas se mantiene: `feature/*` → `develop` (UAT) → `main` (Producción).
- Cuando se implemente el 3er ambiente, se revisará esta estrategia (probablemente separar la DB de producción).
- El aislamiento de datos por usuario es independiente del ambiente y ya está resuelto.

---

## Instrucción para Kiro

1. Ejecutar tareas en orden
2. Las TAREA-003 y 004 son del usuario (config en Vercel/Supabase) — Kiro guía
3. No hacer merge sin aprobación del usuario
4. No hacer push sin autorización explícita
