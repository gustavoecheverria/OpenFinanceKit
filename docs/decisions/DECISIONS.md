# OpenFinanceKit

**Documento:** Decisiones Arquitectónicas (ADR)

**Versión:** 0.3.0

**Estado:** Vigente

**Autor:** Gustavo Echeverría

**Última actualización:** 2026-10-16

---

> **Nota de revisión (2026-10-16).** Este registro solo contenía ADR-001 y ADR-002, pero
> varios documentos citaban un **ADR-WEB-003** que nunca se escribió aquí. Las decisiones
> que faltaban se reconstruyeron a partir de lo que dice el código, los comentarios de
> las migraciones y los SDDs. Si alguna refleja mal la intención original, hay que
> corregirla.

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

**Fecha:** 2026-08-03

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

---

# Decisiones de la aplicación web

### ADR-WEB-003: Sin ORM — acceso directo a Supabase

**Estado:** Aceptada

**Fecha:** 2026-08-28 (reconstruida el 2026-10-16)

#### Contexto

El MVP se diseñó asumiendo Drizzle ORM para las queries. Al revisar contra la base real,
la única capa de datos que realmente se necesita es CRUD sobre seis tablas straightforward
con Row Level Security ya resuelto por Supabase.

#### Decisión

**No usar ORM.** El acceso a datos es directo con `@supabase/supabase-js` y
`@supabase/ssr`. Drizzle queda descartado y no se agrega a `package.json`.

#### Consecuencias

- **Positivas**: Una dependencia menos. Sin paso de generación de tipos. Las queries son
  legibles tal cual se escriben.
- **Negativas**: Sin type-safety a nivel de esquema. Un cambio en la base no lo detecta el
  compilador.
- **Neutrales**: Los tipos se definen a mano en `src/lib/motor/types.ts`.

#### Alternativas consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Drizzle ORM | Queries type-safe, migraciones versionadas | Dependencia extra, paso de generación, schema que duplica la base | El schema ya está en SQL; duplicarlo en TS no aportaba |
| Prisma | Maduro, buen DX | Más pesado, motor propio, peor encaje con RLS de Supabase | Sobredimensionado para 6 tablas |

---

### ADR-WEB-004: Aislamiento por RLS con `user_id` en cada tabla

**Estado:** Aceptada

**Fecha:** 2026-08-27

#### Contexto

Cada usuario debe ver únicamente sus propios datos. La alternativa sería filtrar en cada
consulta, lo que es frágil: basta con olvidar un `.eq('user_id', ...)` en una query para
filtrar datos ajenos.

#### Decisión

El aislamiento vive **en la base de datos**, no en la aplicación. Todas las tablas tienen
`user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE` y las cuatro políticas de RLS
(`SELECT`, `INSERT`, `UPDATE`, `DELETE`) sobre `auth.uid() = user_id`.

Las migraciones de RLS son la `001` (categorias, cuentas, ingresos, gastos), la `004`
(transferencias) y la `006` (pagos_programados).

#### Consecuencias

- **Positivas**: Es imposible filtrar datos ajenos por equivocación en el código. Borrar
  la cuenta de Supabase elimina todos sus datos en cascada.
- **Negativas**: Si falta una de las cuatro políticas, hay una fuga. Una tabla nueva sin
  RLS queda completamente abierta.
- **Neutrales**: Cada query sigue filtrando por `user_id` para el índice, pero por
  rendimiento, no por seguridad.

> **Pendiente de verificación:** AC-018 del SDD de pagos programados sigue abierto. Hay
> 8 políticas activas en la base, pero falta un E2E con dos usuarios que demuestre el
> aislamiento extremo a extremo.

---

### ADR-VER-001: Esquema de versionado y de release

**Estado:** Aceptada

**Fecha:** 2026-10-16

#### Contexto

El proyecto tenía tres números de versión circulando: `package.json` decía `0.2.0`, las
cabeceras de las migraciones SQL decían `0.3.0` y `0.4.0`, y el changelog solo llegaba a
`v0.1.0`. Solo existía el tag `v0.1.0`, aunque v0.2.0 estaba desplegada en producción.

El problema no era el número en sí, sino que `0.4.0` sugería que ya existían releases
`0.2.0` y `0.3.0` publicados, y no era cierto.

#### Decisión

1. **`main` = v0.2.0.** Es la última versión publicada. No se renumera.
2. **Todo lo que está en `develop` es v0.3.0 pendiente de release**, incluidos los
   saldos por cuenta, el detalle de cuenta, la edición de ingresos/gastos y los pagos
   programados.
3. **Las cabeceras de migración no llevan un número de versión propio.** Llevan
   `Release: vX.Y.Z (pendiente)`, que dice en qué release se publica el cambio. Nunca se
   inventa un número.
4. **Cada release lleva tag de git.** v0.2.0 se publicó sin él; hay que backtaguearlo al
   liberar v0.3.0.

#### Consecuencias

- **Positivas**: Una sola historia. `package.json`, changelog, migraciones y tags cuentan
  lo mismo. No hay saltos de versión ni números que no existen.
- **Negativas**: `0.3.0` mezcla varias features en un solo release. Es el costo de no
  haber liberado antes.
- **Neutrales**: La numeración de las migraciones (001–009) es independiente de la
  versión del producto y no debe confundirse con ella.

#### Alternativas consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Adoptar 0.4.0 tal cual | Respetaba lo ya escrito en el SQL | Publica un salto 0.2.0 → 0.4.0 sin nada detrás del 0.3.0 | El número dejaría de describir qué trae el release |
| Volver a 0.2.0 | Simple | Reetiquetaría como-published código que nunca salió | Pierde el registro de lo que hay en `develop` |

---

# Decisiones de pagos programados

### ADR-PAG-001: El estado se calcula, no se almacena

**Estado:** Aceptada

**Fecha:** 2026-10-06

#### Contexto

Un pago programado tiene un ciclo que se renueva solo. La pregunta de diseño era si
guardar el estado (`Pendiente`, `Pagado`, `Vencido`) en la base o calcularlo.

Guardarlo exige un job programado que actualice estados cada cierto tiempo, o que el
estado quede viejo si nadie corre el job. Y renovar el ciclo requiere mover la fecha.

#### Decisión

**La tabla `pagos_programados` no tiene columna de estado.** Guarda solo `fecha_ultimo_pago`,
`dia_vencimiento` y `recurrencia`. El estado ("Al día", "Pendiente", "Alerta", "Vencido")
se calcula en cada render a partir de esas fechas y de la fecha de hoy.

#### Consecuencias

- **Positivas**: No hay jobs programados. No hay estado que se desincronice. La plantilla
  se renueva sola porque solo hay fechas, no un estado que vence.
- **Negativas**: El cálculo corre en cada render en vez de leerse de la base. Con muchos
  pagos sería trabajo por request; hoy no lo es.
- **Neutrales**: Para consultar "cuáles vencen esta semana" hay que calcular en el cliente
  en vez de filtrar con un índice.

#### Alternativas consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Columna `estado` + job diario | Consulta por índice, estado listo | Necesita cron, falla si el job no corre, dos fuentes de verdad | Un job que no corre produce datos incorrectos en silencio |
| Columna `estado` actualizada al pagar | Simple | El estado se vuelve viejo solo con el paso del tiempo | Un pago pagado hace 40 días sigue diciendo "Pagado" |

---

### ADR-PAG-002: Eliminar el módulo de pagos únicos

**Estado:** Aceptada

**Fecha:** 2026-10-07

#### Contexto

El módulo de pagos únicos modelaba un compromiso de pago de **una sola vez**, con su
propia tabla `pagos` y su propia pantalla. Nunca funcionó: la migración que agregaba
`pagos.cuenta_id` nunca se aplicó en la base real, así que el formulario fallaba siempre
con *"No se pudo guardar el pago. Intenta de nuevo."*

Además, el módulo tenía un defecto de diseño: marcar un pago como "Pagado" solo cambiaba
una etiqueta de estado. No creaba nada en `gastos` ni en `ingresos`, así que el historial
no reflejaba lo que había pasado, y al cambiar de mes el pago desaparecía.

#### Decisión

**Eliminar el módulo por completo.** La tabla `pagos` se dropea (migración `008`, con
`CASCADE`) y se borran `/pagos/nuevo` y `/pagos/sin-asignar`.

Los 5 pagos pendientes del usuario se convirtieron a mano en pagos programados antes del
drop. Ninguno estaba en estado "Pagado", así que ningún saldo registrado cambió.

> ⚠️ **El drop fue `CASCADE` y no hay respaldo en el repo.** Los 5 registros se fueron con
> la tabla. El único respaldo quedó en el historial de la conversación del 2026-10-07.
> Para cualquier migración futura que elimine datos, guardar el respaldo en el repo
> antes de ejecutar.

#### Consecuencias

- **Positivas**: Un solo modelo para los pagos. Un módulo menos que mantener. Se elimina
  un camino que estaba roto.
- **Negativas**: Migración destructiva e irreversible. Se perdió el historial de pagos
  únicos, que era recuperable solo de forma manual.
- **Neutrales**: El spec `feature-pagos-sin-asignar` queda cancelado; el problema que
  resolvía desapareció con la tabla.

#### Alternativas consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Arreglar la migración 002 y mantener el módulo | Reutiliza trabajo hecho | Dos modelos de pago conviviendo, con la misma tabla `gastos` detrás | Duplica un concepto que los pagos programados ya cubren |
| Fusionar pagos únicos y programados en una tabla | Una sola tabla | Obliga a filtrar por recurrencia en cada cálculo del Motor y a recalcular el balance histórico | Son dos entidades distintas, no dos variantes de la misma |

---

### ADR-PAG-003: Desactivar no es eliminar

**Estado:** Aceptada

**Fecha:** 2026-10-08

#### Contexto

Inicialmente un pago programado se podía borrar de la fila. Eso rompía la trazabilidad: al
borrar, el historial de lo que se pagó se perdía.

#### Decisión

**Un pago programado nunca se borra.** Se desactiva con `activo = FALSE` y se conserva el
registro. Se puede reactivar.

No se agrega columna `borrado`: la app ya filtra por `activo = true` y una columna que
nadie lee es deuda. Basta con eliminar la función de borrado para que el camino no exista.

En cambio, **categorías y cuentas sí se borran**, siempre que nada las referencie. Si hay
referencias, la base lo bloquea con `ON DELETE RESTRICT` y la app avisa.

#### Consecuencias

- **Positivas**: El historial de pagos no se pierde. Desactivar es reversible; borrar no
  lo era.
- **Negativas**: La lista tiene que filtrar por `activo = true` en todas partes. Un pago
  desactivado ocupa espacio y aparece en consultas sin filtro.
- **Neutrales**: El usuario puede acumular plantillas que ya no usa sin poder limpiarlas.

#### Alternativas consideradas

| Alternativa | Pros | Contras | Razón de descarte |
|-------------|------|---------|-------------------|
| Borrado lógico con columna `borrado` | Igual de reversible, más explícito | Columna que nadie lee además de `activo` | Duplicaría el mismo concepto |
| Borrado físico | Base limpia | Destruye el historial de pagos | Irreversible y sin aviso |