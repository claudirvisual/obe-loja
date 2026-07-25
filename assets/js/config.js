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

  // Testimonios reales. Vacío = la sección no aparece. NO inventar.
  // Formato: { nombre: "", ciudad: "", texto: "" }
  TESTIMONIOS: [],

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
