// ============================================================================
// Capa de datos — lee de la API del ERP (config + catálogo) con fallback a
// Supabase REST directo para el catálogo si la API no responde.
// ============================================================================
import { CONFIG } from "./config.js?v=2";

const API = CONFIG.API_BASE;
const REST = `${CONFIG.SUPABASE_URL}/rest/v1`;

function sbHeaders(extra = {}) {
  return {
    apikey: CONFIG.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

// Columnas del fallback directo a Supabase (mismo shape que devuelve la API).
const CURSO_COLS = [
  "id", "codigo", "nome", "descricao", "ementa", "o_que_estuda",
  "duracao_meses", "carga_horaria", "modalidade", "qtd_certificados",
  "valor_total_gs", "valor_avista_gs", "valor_boleto_gs", "parcelas_boleto_gs",
  "desconto_pontualidade_gs", "imagem_url", "vitrine_video_url", "vitrine_destaque",
].join(",");

let _cache = null;
let _configCache = undefined;

/**
 * Estado de bloqueo (control plane SUPREMA-SI). La tienda lo lee directo de
 * Supabase (anon). Fail-open: si no responde, devuelve null y el sitio funciona.
 */
export async function fetchGate() {
  try {
    const url =
      `${REST}/control_gate?select=block_loja,aviso,msg_loja,msg_aviso` +
      `&escola_id=eq.${CONFIG.ESCOLA_ID}&limit=1`;
    const res = await fetch(url, { headers: sbHeaders() });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0] || null;
  } catch {
    return null;
  }
}

/** Config de la tienda (textos, imágenes, prueba social, contacto, flags). */
export async function fetchVitrineConfig() {
  if (_configCache !== undefined) return _configCache;
  try {
    const res = await fetch(
      `${API}/api/vitrine/config?escola=${encodeURIComponent(CONFIG.ESCOLA_ID)}`
    );
    if (!res.ok) throw new Error(`config ${res.status}`);
    _configCache = await res.json();
  } catch {
    _configCache = null; // usa los valores por defecto de config.js
  }
  return _configCache;
}

/** Catálogo visible en la tienda (vía API; fallback a Supabase directo). */
export async function fetchCursos() {
  if (_cache) return _cache;
  try {
    const res = await fetch(
      `${API}/api/vitrine/cursos?escola=${encodeURIComponent(CONFIG.ESCOLA_ID)}`
    );
    if (!res.ok) throw new Error(`cursos ${res.status}`);
    _cache = await res.json();
    return _cache;
  } catch {
    // Fallback: lee pedagogico_cursos directo con la anon key (solo visibles)
    const url =
      `${REST}/pedagogico_cursos?select=${CURSO_COLS}` +
      `&escola_id=eq.${CONFIG.ESCOLA_ID}&vitrine_visivel=eq.true&order=nome.asc`;
    const res = await fetch(url, { headers: sbHeaders() });
    if (!res.ok) throw new Error(`Catálogo no disponible (${res.status})`);
    _cache = await res.json();
    return _cache;
  }
}

/** Un curso por id (usa la caché; si no, lo busca directo en Supabase). */
export async function fetchCurso(id) {
  if (_cache) {
    const hit = _cache.find((c) => c.id === id);
    if (hit) return hit;
  }
  const url =
    `${REST}/pedagogico_cursos?select=${CURSO_COLS}` +
    `&escola_id=eq.${CONFIG.ESCOLA_ID}&id=eq.${encodeURIComponent(id)}&limit=1`;
  const res = await fetch(url, { headers: sbHeaders() });
  if (!res.ok) throw new Error(`Curso no disponible (${res.status})`);
  const rows = await res.json();
  return rows[0] || null;
}

/**
 * Arma el enlace de WhatsApp con la solicitud de inscripción ya formateada.
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
 * Devuelve { ok, mode, detail }. Nunca lanza.
 */
export async function submitLead(lead) {
  const payload = {
    nombre: lead.nombre,
    email: lead.email || null,
    telefono: lead.telefono || null,
    curso: lead.curso || null,
    documento: lead.documento || null,
    mensaje: lead.mensaje || null,
    origem: CONFIG.LEAD_ORIGEM,
  };

  if (CONFIG.LEAD_MODE === "off") {
    return { ok: true, mode: "off", detail: "modo demo — no se envió nada" };
  }

  try {
    const res = await fetch(CONFIG.LEAD_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return { ok: true, mode: "api" };
  } catch (err) {
    return { ok: false, mode: CONFIG.LEAD_MODE, detail: String(err) };
  }
}
