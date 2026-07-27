// ============================================================================
// OBE Informática — Vitrine / E-commerce · Configuración
// ----------------------------------------------------------------------------
// Escuela de formación profesional (Paraguay). Idioma: castellano.
// Moneda: Guaraní (Gs). Cobro: exclusivamente por carné (cuotas), sin gateway.
// ============================================================================

export const CONFIG = {
  // --- Supabase (clave pública anon — segura para el front) ---------------
  SUPABASE_URL: "https://grxutdnplfckxjorglti.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeHV0ZG5wbGZja3hqb3JnbHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NzAzNzMsImV4cCI6MjEwMDE0NjM3M30.wlbrPjt1D8PhLJeuu6TKfSjkL_5VQxIQ1zaoILTdPUc",

  // Filtrar SIEMPRE por esta escuela
  ESCOLA_ID: "2ded99dd-6daf-47bd-b6bc-38a6c5a74d8b",

  // --- Enlaces a las otras caras del sistema (ya en el aire) ---------------
  URL_ALUMNOS: "https://alumnos.obeinformatica.com",
  URL_PANEL: "https://panel.obeinformatica.com",
  URL_API: "https://api.obeinformatica.com",

  // --- Contacto (completar cuando el cliente lo defina) --------------------
  // Dejar vacío oculta el botón/enlace. Formato internacional sin "+" ni espacios.
  WHATSAPP_NUMBER: "595986686132", // 0986-686132 (Paraguay, formato internacional)
  EMAIL_CONTACTO: "eliobx@hotmail.com",
  TELEFONO: "", // ej: "0981 123 456"
  DIRECCION: "Av. Mondaí, al costado del Supermercado Stock — Presidente Franco, Alto Paraná, PY",
  INSTAGRAM_URL: "https://instagram.com/obeinformatica",

  // --- Prueba social (NO inventamos datos: null/0 oculta el dato) ----------
  SOCIAL_PROOF: {
    anos: null, // ej: 10  -> "10+ años de experiencia"
    alumnos: null, // ej: 500 -> "500+ alumnos"
    docentes: null, // ej: 8
    // "cursos" se calcula solo desde el catálogo
  },

  // ==========================================================================
  // CONTENIDO DE EJEMPLO (placeholders para completar) -----------------------
  // --------------------------------------------------------------------------
  // ⚠️ IMPORTANTE: estas secciones traen texto de EJEMPLO (Lorem ipsum) para
  //    que se vean en la vitrine y sepas dónde va cada cosa. Antes de publicar
  //    en serio: reemplazá por texto REAL, o vaciá el arreglo ([]) para ocultar
  //    la sección, o poné MOSTRAR_PLACEHOLDERS en false para ocultarlas todas.
  //
  //    MOSTRAR_PLACEHOLDERS true  -> muestra las secciones de ejemplo con un
  //                                   sello "Contenido de ejemplo" (para que
  //                                   nadie confunda el Lorem con texto real).
  //    MOSTRAR_PLACEHOLDERS false -> oculta TODO el contenido de ejemplo.
  MOSTRAR_PLACEHOLDERS: true,

  // ¿Quiénes somos? — reemplazá por la historia real de OBE Informática.
  QUIENES_SOMOS: {
    titulo: "¿Quiénes somos?",
    parrafos: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. OBE Informática es una institución de formación profesional en Paraguay. (Texto de ejemplo — reemplazar por la descripción real.)",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. (Texto de ejemplo — completar.)",
    ],
    // Galería: cantidad de fotos de ejemplo a mostrar (0 = sin galería).
    // Cuando tengas fotos reales, se cambia por rutas de imagen.
    galeria_placeholders: 6,
  },

  // Testimonios. Vacío = la sección no aparece. Reemplazá por reseñas REALES.
  // Formato: { nombre: "", ciudad: "", texto: "" }
  TESTIMONIOS: [
    {
      nombre: "Nombre Apellido (ejemplo)",
      ciudad: "Presidente Franco",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. (Reemplazar por un testimonio real.)",
    },
    {
      nombre: "Nombre Apellido (ejemplo)",
      ciudad: "Ciudad del Este",
      texto:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. (Reemplazar por un testimonio real.)",
    },
    {
      nombre: "Nombre Apellido (ejemplo)",
      ciudad: "Hernandarias",
      texto:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. (Reemplazar por un testimonio real.)",
    },
  ],

  // Aliados / certificaciones / menciones. Vacío = sección oculta.
  // NO inventar sellos reales (MEC, etc.). Completar solo con lo verdadero.
  ALIADOS: [
    { nombre: "Aliado / Certificación (ejemplo)" },
    { nombre: "Aliado / Certificación (ejemplo)" },
    { nombre: "Aliado / Certificación (ejemplo)" },
    { nombre: "Aliado / Certificación (ejemplo)" },
  ],

  // --- Envío de solicitudes de inscripción (checkout = lead / carné) ------
  // ⚠️ PENDIENTE DE CONFIRMAR CON CLAUDIR (proyecto principal):
  //    ¿inserción directa en `leads` con anon, o endpoint público en la API?
  //
  //   "whatsapp" -> abre WhatsApp con la solicitud ya formateada (no usa el banco).
  //   "supabase" -> inserta en la tabla `leads` vía PostgREST con la anon key.
  //   "api"      -> POST a LEAD_API_ENDPOINT (endpoint público de la API).
  //   "off"      -> no envía nada; solo muestra el resumen (modo demo seguro).
  // Nota: el INSERT directo con `anon` está bloqueado por RLS en este proyecto
  // (probado 2026-07-25). Por eso se usa "whatsapp" hasta habilitar la policy.
  LEAD_MODE: "whatsapp",
  LEAD_API_ENDPOINT: "https://api.obeinformatica.com/public/leads",

  // Origen que se guarda en cada lead para rastrear la fuente
  LEAD_ORIGEM: "vitrine-web",
};
