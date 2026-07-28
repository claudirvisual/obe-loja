// ============================================================================
// OBE Informática — Vitrine / E-commerce · Configuración
// ----------------------------------------------------------------------------
// Escuela de formación profesional (Paraguay). Idioma: castellano.
// Moneda: Guaraní (Gs). Cobro: exclusivamente por carné (cuotas), sin gateway.
//
// ⚠️ FUENTE DE LA VERDAD: el contenido de la tienda (textos, imágenes, cursos,
//    prueba social, contacto, secciones) se edita en el ERP → módulo "Tienda".
//    La tienda lo lee en vivo desde la API. Lo de acá abajo son solo los
//    VALORES POR DEFECTO (fallback) por si la API no responde.
// ============================================================================

export const CONFIG = {
  // --- API del ERP (de donde la tienda lee config + catálogo) -------------
  API_BASE: "https://api.obeinformatica.com",

  // --- Supabase (fallback de catálogo si la API no responde) --------------
  SUPABASE_URL: "https://grxutdnplfckxjorglti.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeHV0ZG5wbGZja3hqb3JnbHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NzAzNzMsImV4cCI6MjEwMDE0NjM3M30.wlbrPjt1D8PhLJeuu6TKfSjkL_5VQxIQ1zaoILTdPUc",
  ESCOLA_ID: "2ded99dd-6daf-47bd-b6bc-38a6c5a74d8b",

  // --- Enlaces a las otras caras del sistema ------------------------------
  URL_ALUMNOS: "https://alumnos.obeinformatica.com",
  URL_PANEL: "https://panel.obeinformatica.com",
  URL_API: "https://api.obeinformatica.com",

  // --- Logo (si el panel sube uno, lo reemplaza) --------------------------
  LOGO_URL: "",

  // --- Encabezado (hero) — editable en el panel ---------------------------
  HERO: {
    titulo: "Transformá tu vida",
    destaque: "estudiando",
    titulo_fim: "desde cualquier lugar del Paraguay",
    subtitulo:
      "Cursos con certificado, pensados para el mercado laboral paraguayo. Pagás cómodamente por carné, en cuotas.",
    benefits: ["Certificado incluido", "Pago por carné, en cuotas", "Docentes del área"],
  },

  // --- Contacto (fallback; se edita en el panel) --------------------------
  WHATSAPP_NUMBER: "595986686132",
  EMAIL_CONTACTO: "eliobx@hotmail.com",
  TELEFONO: "",
  DIRECCION: "Av. Mondaí, al costado del Supermercado Stock — Presidente Franco, Alto Paraná, PY",
  INSTAGRAM_URL: "https://instagram.com/obeinformatica",

  // --- Texto de la forma de pago (editable en el panel) -------------------
  PAGO_NOTA: "Pago por carné, en cuotas · Guaraníes",

  // --- Prueba social (se edita en el panel; null/0 oculta el dato) --------
  SOCIAL_PROOF: { anos: null, alumnos: null, docentes: null },

  // --- Contenido de secciones (se llena desde el panel) -------------------
  QUIENES_SOMOS: { titulo: "¿Quiénes somos?", parrafos: [], galeria: [] },
  TESTIMONIOS: [], // { nombre, ciudad, texto }
  ALIADOS: [], // { nombre, logo_url }
  FAQ_CUSTOM: [], // si tiene items, reemplaza las preguntas por defecto

  // --- Qué secciones se muestran (las controla el panel) ------------------
  FLAGS: {
    mostrar_quienes: false,
    mostrar_testimonios: false,
    mostrar_aliados: false,
    mostrar_social_proof: false,
  },

  // --- Envío de solicitudes de inscripción --------------------------------
  //   "api"      -> POST al endpoint público del ERP (crea el lead). [por defecto]
  //   "whatsapp" -> abre WhatsApp con la solicitud ya formateada.
  LEAD_MODE: "api",
  LEAD_API_ENDPOINT: "https://api.obeinformatica.com/api/vitrine/inscripcion",
  LEAD_ORIGEM: "vitrine-web",
};
