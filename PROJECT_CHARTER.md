# OpenFinanceKit

**Documento:** Project Charter
**Versión:** 0.3.0
**Estado:** Vigente
**Sprint actual:** Sprint 5 (liberar v0.3.0)
**Autor:** Gustavo Echeverría
**Última actualización:** 2026-10-16

---

## Nombre del proyecto

**OpenFinanceKit**

**Acrónimo:** OFK

**Licencia:** MIT

**Repositorio:** https://github.com/gustavoecheverria/OpenFinanceKit

---

## Visión

OpenFinanceKit es una plataforma modular de gestión financiera diseñada para ayudar a personas y organizaciones a administrar sus finanzas mediante una arquitectura escalable, comenzando con una implementación en Excel y evolucionando hacia un ecosistema de herramientas profesionales.

---

## Misión

Construir una solución financiera abierta, documentada y extensible que permita administrar ingresos, gastos, presupuestos, flujo de caja y patrimonio utilizando buenas prácticas de ingeniería de software.

---

## Objetivo a largo plazo

No estamos construyendo un Excel para llevar finanzas personales.

Estamos construyendo un **framework de gestión financiera**. El Excel es únicamente la primera implementación.

### Ecosistema OFK

```
OpenFinanceKit (OFK)
│
├── OFK Excel          ← Implementación de referencia, ya superada por la web
│
├── OFK Web            ← ACTIVO. Next.js 15 + Supabase, app PWA
│
├── OFK Mobile         ← Futuro
│
├── OFK API            ← Futuro
│
├── OFK Power BI       ← Futuro
│
├── OFK AI Assistant   ← Futuro
│
├── OFK Automation     ← Futuro (n8n)
│
└── OFK Empresa        ← Visión no implementada
```

Todos los módulos comparten las mismas **reglas de negocio** documentadas en
[`docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md).

---

## Alcance actual

| Elemento | Descripción |
|----------|-------------|
| Módulo activo | **OFK Web** |
| Producto en producción | v0.3.0 (rama `main`) |
| Producto en desarrollo | v0.3.x (rama `develop`) |
| Stack | Next.js 15 + TypeScript 5 + Tailwind 4 + Supabase + Vercel |
| Usuario objetivo | Persona individual que quiere entender sus finanzas |
| Repositorio | https://github.com/gustavoecheverria/OpenFinanceKit |

### Fuera de alcance

OFK Web **no** es, y no pretende ser de momento:

- un sistema contable (no hay partida doble ni asientos)
- un sistema de facturación (no hay facturas ni terceros)
- un ERP multiempresa (no hay tenants ni roles)

Esa visión existe en el [anexo de `docs/BUSINESS_RULES.md`](docs/BUSINESS_RULES.md).
Retomarla no sería una evolución incremental: cambiaría el modelo de datos entero, el
Motor y la arquitectura.

---

## Principios del proyecto

1. **Documentation-first** — La documentación precede a la implementación
2. **Fuente única de verdad** — Cada tipo de información tiene una herramienta oficial
   (ver ADR-002)
3. **Versionado semántico** — Todos los cambios siguen Semantic Versioning desde v0.1.0
4. **Documentación siempre al día** — Actualizar la documentación es parte del cambio,
   no un extra. Si el código y la documentación discrepan, se arregla en el mismo commit
5. **Modularidad** — Cada módulo del ecosistema es independiente pero comparte las reglas
   de negocio
6. **Buenas prácticas de ingeniería** — El proyecto se trata como software profesional
7. **Simplicidad antes que complejidad** — Preferir lo simple que se entienda a lo
   elegante que no

---

## Estándar de encabezado de documentos

Todos los documentos del proyecto deben comenzar con el siguiente encabezado:

```markdown
# OpenFinanceKit

**Documento:** [Nombre del documento]
**Versión:** [X.Y.Z]
**Estado:** [Draft | Review | Aprobado]
**Sprint:** [Sprint N]
**Autor:** [Nombre]
**Última actualización:** [YYYY-MM-DD]
```

---

## Estructura del repositorio

```
OpenFinanceKit/
├── apps/web/           ← La aplicación (Next.js 15)
├── docs/               ← Documentación técnica
├── product/excel/      ← OFK Excel original (referencia histórica)
├── qa/                 ← Evidencia y reportes de pruebas
├── scripts/            ← Automatización en Python
├── diagrams/           ← Diagramas
├── backlog/            ← Vacío: el backlog vive en GitHub Projects
└── .kiro/              ← Configuración de los agentes IA
```

> **Nota:** La carpeta `automation/` no existe. Se creará cuando se implemente
> **OFK Automation**, para alojar flujos de n8n.

## Documentos del proyecto

| Documento | Qué es |
|-----------|--------|
| [README.md](./README.md) | Punto de entrada: qué es, cómo correrlo, cómo contribuir |
| [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md) | **Estado real del proyecto.** Empieza por acá |
| [docs/roadmap/ROADMAP.md](./docs/roadmap/ROADMAP.md) | Qué se hizo y qué sigue |
| [docs/changelog/CHANGELOG.md](./docs/changelog/CHANGELOG.md) | Qué cambió en cada versión |
| [docs/BUSINESS_RULES.md](./docs/BUSINESS_RULES.md) | Reglas del dominio |
| [docs/DATA_DICTIONARY.md](./docs/DATA_DICTIONARY.md) | Modelo de datos |
| [docs/decisions/DECISIONS.md](./docs/decisions/DECISIONS.md) | Decisiones arquitectónicas |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guía de contribución |

---

## Firmas

| Rol | Nombre | Fecha |
|-----|--------|-------|
| Autor / Product Owner | Gustavo Echeverría | 2026-08-03 |
| Revisión v0.3.0 | Gustavo Echeverría + Kiro | 2026-10-16 |