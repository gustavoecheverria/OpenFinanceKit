# OpenFinanceKit

**Documento:** Decisiones Arquitectónicas (ADR)

**Versión:** 0.1.0

**Estado:** Draft

**Sprint:** Sprint 1

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-08-03

---


Este documento registra las decisiones arquitectónicas significativas tomadas en el proyecto OpenFinanceKit. Utilizamos el formato ADR (Architectural Decision Record) para documentar el contexto, la decisión tomada y sus consecuencias de manera estructurada.

## ¿Por qué documentar decisiones?

Las decisiones arquitectónicas tienen impacto a largo plazo en el proyecto. Documentarlas nos permite:

- **Memoria institucional**: Entender por qué se tomaron ciertas decisiones cuando el contexto original ya no es evidente.
- **Onboarding**: Facilitar la incorporación de nuevos miembros al equipo.
- **Evaluación**: Revisar decisiones pasadas cuando las circunstancias cambian.
- **Transparencia**: Mantener un registro claro del razonamiento detrás de cada elección.

---

## Formato ADR

Cada decisión se documenta siguiendo este template:

```markdown
### ADR-NNN: [Título de la Decisión]

**Estado:** [Propuesta | Aceptada | Deprecada | Sustituida por ADR-XXX]

**Fecha:** YYYY-MM-DD

#### Contexto

Descripción del problema o situación que requiere una decisión.
¿Qué fuerzas están en juego? ¿Qué restricciones existen?

#### Decisión

La decisión tomada, expresada de forma clara y directa.
"Decidimos [hacer X] porque [razón principal]."

#### Consecuencias

- **Positivas**: Beneficios esperados de esta decisión.
- **Negativas**: Costos, riesgos o trade-offs aceptados.
- **Neutrales**: Implicaciones que no son claramente positivas ni negativas.

#### Alternativas Consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Alternativa 1 | ... | ... | ... |
| Alternativa 2 | ... | ... | ... |
```

---

## Decisiones

### ADR-001: Enfoque documentation-first para el Sprint 1

**Estado:** Aceptada

**Fecha:** 2025-01-20

#### Contexto

Al iniciar el proyecto OpenFinanceKit, necesitábamos definir la estrategia del primer sprint. Las opciones incluían comenzar directamente con código de aplicación, configurar infraestructura técnica, o establecer primero la estructura del proyecto y su documentación base.

El equipo es pequeño y el proyecto tiene un alcance ambicioso (gestión financiera con IA). Sin una base documental sólida, existe el riesgo de tomar decisiones técnicas prematuras o inconsistentes a medida que el proyecto crezca.

#### Decisión

Decidimos dedicar el Sprint 1 exclusivamente a la estructura del proyecto y documentación base, sin implementar código de aplicación. Esto incluye:

- Crear la estructura completa de directorios
- Documentar la arquitectura inicial, reglas de negocio y modelo de datos
- Establecer templates de GitHub para colaboración
- Definir el roadmap de sprints futuros

#### Consecuencias

- **Positivas**:
  - Base sólida de documentación antes de escribir código
  - Alineación del equipo sobre estructura y convenciones
  - Menor deuda técnica en documentación a futuro
  - Facilita onboarding de nuevos colaboradores desde el inicio
- **Negativas**:
  - No hay código funcional al final del Sprint 1
  - Puede percibirse como progreso lento inicialmente
- **Neutrales**:
  - Las decisiones técnicas de stack se postergan al Sprint 2
  - La estructura puede evolucionar en sprints posteriores

#### Alternativas Consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Iniciar con código directamente | Progreso visible rápido | Documentación se posterga indefinidamente, decisiones ad-hoc | Alto riesgo de deuda técnica y falta de alineación |
| Sprint mixto (código + docs) | Balance entre documentación y funcionalidad | Ninguna de las dos se hace a profundidad | Calidad insuficiente en ambas áreas |
| Solo infraestructura técnica | CI/CD listo desde el inicio | Sin contexto de negocio documentado | Prematuro sin definir arquitectura y reglas |

---

### ADR-002: Mapa de herramientas y fuente única de verdad

**Estado:** Aceptada

**Fecha:** 2026-08-03

#### Contexto

El proyecto usa múltiples herramientas (GitHub, Notion, n8n). Sin una regla clara sobre qué vive en cada una, la información se dispersa y aparecen dudas sobre cuál es la versión correcta de un documento o decisión.

#### Decisión

Definimos una asignación fija de herramienta por tipo de información. Cada tipo de contenido tiene **una sola fuente de verdad**:

| Tipo de información | Herramienta oficial |
|---------------------|-------------------|
| Código y archivos Excel | GitHub |
| Documentación técnica | GitHub (`docs/`) |
| Diagramas técnicos | Mermaid en Markdown (GitHub) |
| Gestión del trabajo | GitHub Projects |
| Historias de usuario y bugs | GitHub Issues |
| Releases y versionado | GitHub Releases |
| Investigación e ideas | Notion |
| Notas de reuniones | Notion |
| Automatizaciones de flujo | n8n (Fase 3) |

#### Consecuencias

- **Positivas**:
  - Siempre hay claridad sobre dónde buscar cada tipo de información
  - Se evita duplicación y versiones desincronizadas
  - Incorporación de nuevos colaboradores más sencilla
  - GitHub como repositorio central auditado y versionado
- **Negativas**:
  - Requiere disciplina para respetar la asignación
  - Notion no reemplaza a GitHub para documentación técnica
- **Neutrales**:
  - Diagramas en Mermaid en lugar de Draw.io externo (viven en Git, se renderizan en GitHub)

#### Alternativas Consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Todo en Notion | Una sola herramienta | No versiona código, no soporta PR ni revisión formal | Rompe el flujo de trabajo de ingeniería |
| Todo en GitHub | Máxima consistencia | Wiki de GitHub es inferior a Notion para notas colaborativas | Experiencia de trabajo colaborativo pobre |
| Notion + GitHub sin reglas | Flexibilidad total | Información duplicada, versiones incorrectas, confusión | Genera exactamente el problema que queremos evitar |