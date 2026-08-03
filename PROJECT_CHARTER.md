# OpenFinanceKit

**Documento:** Project Charter

**Versión:** 0.1.0

**Estado:** Draft

**Sprint:** Sprint 1

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-03

---


**Documento:** Project Charter

**Versión:** 0.1.0

**Estado:** Draft

**Sprint:** Sprint 1

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-03

---

## Nombre del proyecto

**OpenFinanceKit**

**Acrónimo:** OFK

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
├── OFK Excel          ← Implementación actual (v0.1.x)
│
├── OFK Web            ← Interfaz web (futuro)
│
├── OFK Mobile         ← Aplicación móvil (futuro)
│
├── OFK API            ← API REST/GraphQL (futuro)
│
├── OFK Power BI       ← Dashboards avanzados (futuro)
│
├── OFK AI Assistant   ← Asistente con inteligencia artificial (futuro)
│
└── OFK Automation     ← Flujos automatizados con n8n (futuro)
```

Todos los módulos comparten las mismas **reglas de negocio** documentadas en `docs/BUSINESS_RULES.md`.

---

## Alcance actual (Sprint 1)

| Elemento | Descripción |
|----------|-------------|
| Módulo activo | OFK Excel |
| Tecnología | Markdown + Excel |
| Entregable | Infraestructura del proyecto + documentación base |
| Repositorio | https://github.com/gustavoecheverria/OpenFinanceKit |

---

## Principios del proyecto

1. **Documentation-first** — La documentación precede a la implementación
2. **Fuente única de verdad** — Cada tipo de información tiene una herramienta oficial (ver ADR-002)
3. **Versionado semántico** — Todos los cambios siguen Semantic Versioning desde v0.1.0
4. **Modularidad** — Cada módulo del ecosistema es independiente pero comparte las reglas de negocio
5. **Buenas prácticas de ingeniería** — El proyecto se trata como software profesional desde el día uno

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

## Referencias

- [README.md](./README.md) — Descripción general del proyecto
- [docs/decisions/DECISIONS.md](./docs/decisions/DECISIONS.md) — Decisiones arquitectónicas
- [docs/roadmap/ROADMAP.md](./docs/roadmap/ROADMAP.md) — Hoja de ruta por sprints
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Guía de contribución