# OpenMind – Plan de Arquitectura DDD

## 1. Contextos delimitados (Bounded Contexts)

| Contexto | Propósito | Stakeholders clave | Notas de integración |
|----------|-----------|--------------------|-----------------------|
| **Atención Psicológica** | Gestionar sesiones con especialistas, agenda, notas clínicas y recomendaciones terapéuticas. | Psicólogos/terapeutas, usuarios finales. | Se expone al front vía API REST. Compartirá datos de usuario con Gestión de Identidad. |
| **Formación y Evaluación** | Administrar cursos, módulos, evaluaciones breves y progreso del usuario. | Equipo de contenidos, usuarios. | Produce recomendaciones al contexto de Atención y al Chatbot. |
| **Comunicación y Soporte** | Chatbot, canales de mensajería, derivaciones a líneas de ayuda y notificaciones proactivas. | Chatbot, motor de notificaciones, soporte. | Consume histórico del Chat y entrega insights a Atención Psicológica. |
| **Gestión de Identidad** | Registro, autenticación, roles y preferencias de privacidad. | Equipo de plataforma, usuarios. | Provee identidades y claims a los demás contextos (OpenID Connect / JWT). |

> **Relación con el front actual:** las rutas `/chatbot`, `/recom`, `/profile`, `/home` se mapearán a micro-fronts o módulos que consumen APIs específicas de cada contexto.

## 2. Agregados y Entidades principales

### Atención Psicológica
- **Agregado `SesionPsicologica`** *(root)*  
  - Entidades: `Especialista`, `Agenda`, `NotaClinica`, `ResultadoSesion`.  
  - Value Objects sugeridos: `SesionId`, `HorarioSesion`, `NotasPrivadas`, `EstadoSesion` (enum → programado, en_progreso, completado, cancelado).
  - Reglas: no más de X sesiones simultáneas para un especialista; sesión no puede pasar a estado `completado` sin `ResultadoSesion`.
- **Agregado `PlanAcompañamiento`** *(root)*  
  - Entidades: `ActividadTerapeutica`, `RecomendacionProfesional`.  
  - Value Objects: `DuracionActividad`, `Frecuencia`.  
  - Relación con `SesionPsicologica` mediante `SesionId`.

### Formación y Evaluación
- **Agregado `Curso`** *(root)*  
  - Entidades: `Modulo`, `Leccion`, `Material`.  
  - Value Objects: `TituloCurso`, `Descripcion`, `NivelDificultad`.
- **Agregado `Evaluacion`** *(root)*  
  - Entidades: `Pregunta`, `Respuesta`, `ResultadoEvaluacion`.  
  - Value Objects: `Calificacion`, `TiempoEstimado`.  
  - `ResultadoEvaluacion` se asocia al usuario vía `UsuarioId` (del contexto de Identidad).
- **Agregado `ProgresoAprendizaje`** *(root)*  
  - Entidades: `Hito`, `Recompensa`.  
  - Value Objects: `PorcentajeProgreso`, `EstadoHito`.

### Comunicación y Soporte
- **Agregado `Conversacion`** *(root)* — versión backend del historial actual.  
  - Entidades: `Mensaje`, `Derivacion`, `EtiquetaEmocional`.  
  - Value Objects: `MensajeId`, `Canal`, `TonoEmocional`, `Timestamp`.  
  - Usa `UsuarioId` y opcionalmente `SesionId` para correlacionar con Atención Psicológica.
- **Agregado `Notificacion`** *(root)*  
  - Value Objects: `NotificacionId`, `TipoNotificacion`, `Destino` (email, push, sms).  
  - Entidades: `Plantilla`, `LogEntrega`.
- **Servicio de dominio `MotorChatbot`**  
  - Interfaces: `ProcesadorMensaje`, `MotorRecomendacion`, `DerivadorProfesional`.  
  - Integraciones: LLM externo, base de conocimientos, endpoints de Atención Psicológica para derivaciones.

### Gestión de Identidad
- **Agregado `Usuario`** *(root)*  
  - Entidades: `RolUsuario`, `PreferenciaPrivacidad`, `PerfilSalud`.  
  - Value Objects: `EmailVO`, `NombreVO`, `Telefono`, `HashPassword`.  
  - Eventos de dominio: `UsuarioRegistrado`, `RolActualizado`, `AceptoPoliticaDatos`.
- **Agregado `SesionAutenticacion`** *(root)*  
  - Value Objects: `TokenJWT`, `RefreshToken`, `TiempoExpiracion`.  
  - Coordina con un servicio de identidad (Auth0, Keycloak, Cognito o servicio propio).

## 3. Value Objects comunes
- `EmailValueObject` (ya presente en el front): se moverá a la capa de dominio del contexto de Identidad.
- `TimestampVO`, `Duracion`, `TelefonoVO`, `NombreCompletoVO`, `DocumentoIdentidadVO` (si se requiere verificación).
- `IdiomaPreferido`, `LocalizacionVO` (para ofrecer recursos regionales).

## 4. Servicios de dominio y aplicaciones

### Servicios de Dominio
- `AgendaService` (Atención): valida disponibilidad, política de cancelaciones, envía eventos a Notificaciones.
- `EvaluacionService` (Formación): calcula puntajes, determina planes de mejora y genera eventos `EvaluacionCompletada`.
- `ChatbotOrchestrator` (Comunicaciones): decide respuesta del bot, dispara `DerivacionRequerida`, `RecomendacionGenerada`.
- `PrivacidadService` (Identidad): aplica reglas de consentimiento y anonimización antes de compartir datos entre contextos.

### Servicios de Aplicación (Application Layer)
- REST / GraphQL controllers por contexto.
- Transforman DTO ↔ Value Objects / Entidades.
- Publican eventos a un bus (Kafka, RabbitMQ o integración nativa de la plataforma) para sincronización entre contextos.

## 5. Infraestructura y persistencia (propuesta)
- Microservicios o módulos independientes alojados en un monorepo (NestJS / Spring Boot) o arquitectura de servicios.  
- BDs por contexto (evitar coupling):  
  - Atención: PostgreSQL (sesiones, planes).  
  - Formación: PostgreSQL o MongoDB (contenido).  
  - Comunicación: MongoDB (historial chat), Redis para colas en tiempo real.  
  - Identidad: servicio externo (Auth0) o PostgreSQL + Keycloak.
- Bus de eventos para integración asincrónica: `UsuarioRegistrado`, `SesionProgramada`, `DerivacionEmitida`, `ResultadoEvaluacionGenerado`.
- API Gateway para consolidar seguridad, rate limiting y traducción de protocolos (REST ↔ gRPC si aplica).

## 6. Plan de Implementación

1. **Sprint 1 – Identidad y Autenticación**
   - Implementar `Usuario` y autenticación (registro/login, tokens).  
   - Exponer API `/auth` y `/usuarios`.  
   - Alinear el front para consumir la API real.
2. **Sprint 2 – Chatbot persistente e Historial**
   - Crear servicio de Conversaciones con mensajes persistidos y Value Objects.  
   - Ajustar el front para leer/escribir historial vía API.  
   - Integrar `MotorChatbot` con reglas básicas (igual a las actuales) y preparar hook para LLM.  
3. **Sprint 3 – Sesiones Psicológicas**
   - Modelar `SesionPsicologica`, `PlanAcompañamiento`.  
   - Endpoints: agenda, notas, recomendaciones.  
   - Eventos para notificaciones y sincronización con el chatbot.
4. **Sprint 4 – Formación y Evaluaciones**
   - Implementar `Curso`, `Evaluacion` y `Progreso`.  
   - Crear microservicio propio o módulos en el backend principal.  
   - Integrar recomendaciones en front (pestaña `/recom`).
5. **Sprint 5 – Observabilidad y Ética Digital**
   - Auditar eventos, logging sensible, dashboard de métricas.  
   - Revisar contratos de datos y consentimiento.

## 7. Recomendaciones adicionales
- Mantener un **glosario de lenguaje ubicuo**: términos del dominio (p.ej. “Plan Acompañamiento”, “Derivación”) deben ser los mismos en UI, código y documentación.
- Definir **migración gradual** del front: dividir features por contexto y consumir APIs modulares (Angular standalone modules por contexto).
- Establecer **tests de contrato** entre front/back (pactos) para asegurar que los DTO respetan las reglas de dominio.
- Documentar **política de privacidad** y consentimiento en el front; enlazar endpoints de descarga/eliminación de datos.
- Alinear equipo de UX con los bounded contexts para que cada vista responda a un subdominio definido (ej. `/home` como landing cross-context).
