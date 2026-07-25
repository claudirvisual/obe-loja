// ============================================================================
// Capa de datos — Supabase PostgREST (solo lectura pública + alta de leads)
// ============================================================================
import { CONFIG } from "./config.js";

const REST = `${CONFIG.SUPABASE_URL}/rest/v1`;

function headers(extra = {}) {
  return {
    apikey: CONFIG.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

// Columnas del catálogo que necesita la vitrine
const CURSO_COLS = [
  "id",
  "codigo",
  "nome",
  "descricao",
  "ementa",
  "o_que_estuda",
  "duracao_meses",
  "carga_horaria",
  "modalidade",
  "qtd_certificados",
  // Precios en Guaraní (hoy nulos — se muestran cuando el ERP los cargue)
  "valor_total_gs",
  "valor_avista_gs",
  "valor_boleto_gs",
  "parcelas_boleto_gs",
  "desconto_pontualidade_gs",
].join(",");

let _cache = null;

/** Trae los 34 cursos de la escuela OBE (con caché en memoria). */
export async function fetchCursos() {
  if (_cache) return _cache;
  const url =
    `${REST}/pedagogico_cursos?select=${CURSO_COLS}` +
    `&escola_id=eq.${CONFIG.ESCOLA_ID}` +
    `&order=nome.asc`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Catálogo no disponible (${res.status})`);
  _cache = await res.json();
  return _cache;
}

/** Un curso por id (usa la caché si ya está cargada). */
export async function fetchCurso(id) {
  if (_cache) {
    const hit = _cache.find((c) => c.id === id);
    if (hit) return hit;
  }
  const url =
    `${REST}/pedagogico_cursos?select=${CURSO_COLS}` +
    `&escola_id=eq.${CONFIG.ESCOLA_ID}&id=eq.${encodeURIComponent(id)}&limit=1`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Curso no disponible (${res.status})`);
  const rows = await res.json();
  return rows[0] || null;
}

/**
 * Arma el enlace de WhatsApp con la solicitud de inscripción ya formateada.
 * Devuelve null si no hay WHATSAPP_NUMBER configurado.
 */
export function leadWhatsAppUrl(lead) {
  if (!CONFIG.WHATSAPP_NUMBER) return null;
  const texto = [
    "*Nueva solicitud de inscripción — OBE Informática*",
    `Nombre: ${lead.nombre || "-"}`,
    `Curso: ${lead.curso || "-"}`,
    `Teléfono: ${lead.telefono || "-"}`,
    lead.email ? `Correo: ${lead.email}` : null,
    lead.documento ? `Cédula: ${lead.documento}` : null,
    lead.mensaje ? `Mensaje: ${lead.mensaje}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

/**
 * Registra una solicitud de inscripción (checkout = lead / cobro por carné).
 * Devuelve { ok, mode, detail }. Nunca lanza: el modo de envío es configurable
 * y está pendiente de confirmación con el proyecto principal.
 */
export async function submitLead(lead) {
  const payload = {
    nome: lead.nombre,
    email: lead.email || null,
    celular: lead.telefono || null,
    telefone: lead.telefono || null,
    curso: lead.curso || null,
    cpf: lead.documento || null, // en PY sería la Cédula (CI)
    observacao: lead.mensaje || null,
    origem: CONFIG.LEAD_ORIGEM,
    escola_id: CONFIG.ESCOLA_ID,
  };

  if (CONFIG.LEAD_MODE === "off") {
    return { ok: true, mode: "off", detail: "modo demo — no se envió nada" };
  }

  try {
    if (CONFIG.LEAD_MODE === "api") {
      const res = await fetch(CONFIG.LEAD_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      return { ok: true, mode: "api" };
    }

    // Por defecto: inserción directa en `leads` con la anon key
    const res = await fetch(`${REST}/leads`, {
      method: "POST",
      headers: headers({
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Supabase ${res.status}: ${txt}`);
    }
    return { ok: true, mode: "supabase" };
  } catch (err) {
    return { ok: false, mode: CONFIG.LEAD_MODE, detail: String(err) };
  }
}
