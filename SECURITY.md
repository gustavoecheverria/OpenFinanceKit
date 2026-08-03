# Política de Seguridad — OpenFinanceKit

## Versiones soportadas

| Versión | Soporte de seguridad |
|---------|---------------------|
| v0.1.x  | ✅ Activo            |

## Reportar una vulnerabilidad

**Por favor NO abras un issue público para reportar vulnerabilidades de seguridad.**

Dado que OpenFinanceKit maneja datos financieros sensibles, tomamos la seguridad muy en serio.

### Cómo reportar

Envía un correo a **gustavoad.echeverria@gmail.com** con:

1. **Descripción** — Qué es la vulnerabilidad y cuál es su impacto potencial
2. **Pasos para reproducir** — Instrucciones detalladas para reproducir el problema
3. **Versión afectada** — Qué versión del proyecto está afectada
4. **Evidencia** — Capturas, logs o prueba de concepto (sin explotar activamente)

### Qué esperar

- **Confirmación de recepción** en menos de 48 horas
- **Evaluación inicial** en menos de 7 días
- **Resolución o plan de mitigación** comunicado antes de cualquier divulgación pública

### Divulgación responsable

Pedimos un período de **90 días** antes de divulgación pública para poder investigar y resolver el problema. Reconoceremos tu contribución en el CHANGELOG si así lo deseas.

## Buenas prácticas de seguridad en el proyecto

- Nunca commitear credenciales, tokens o secrets en el repositorio
- Usar `.gitignore` para excluir archivos `.env` y `secrets/`
- Datos financieros reales no deben subirse al repositorio
- Los archivos Excel con datos sensibles deben mantenerse solo de forma local
