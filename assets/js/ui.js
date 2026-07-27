// ============================================================================
// Utilidades de presentación (formato, escape, precios en Guaraní)
// ============================================================================

/** Escapa HTML para insertar texto de la base con seguridad. */
export function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Miles con punto, estilo Paraguay: 1250000 -> "1.250.000". */
export function miles(n) {
  if (n == null || isNaN(n)) return "";
  return Math.round(Number(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** "Gs 1.250.000" */
export function gs(n) {
  return `Gs ${miles(n)}`;
}

/**
 * Bloque de precio de un curso. Los precios reales están en las columnas *_gs.
 * Mientras el ERP no las cargue (hoy son nulas) devolvemos un estado
 * "consultar" en lugar de mostrar valores incorrectos. Cuando se carguen,
 * la vitrine muestra automáticamente el precio por carné y al contado.
 */
export function precioCurso(c) {
  const carne = c.valor_boleto_gs;
  const cuotas = c.parcelas_boleto_gs;
  const contado = c.valor_avista_gs;

  if (carne != null && Number(carne) > 0) {
    const porCuota = cuotas && cuotas > 0 ? Number(carne) / Number(cuotas) : null;
    return {
      disponible: true,
      titulo: porCuota
        ? `${cuotas} cuotas de ${gs(porCuota)}`
        : `${gs(carne)} por carné`,
      total: `${gs(carne)} en total`,
      contado: contado != null ? `${gs(contado)} al contado` : null,
    };
  }
  return { disponible: false, titulo: "Consultá el valor", total: null, contado: null };
}

/** Convierte texto plano/con <br> de la base en párrafos seguros. */
export function richText(s) {
  if (!s) return "";
  // La base ya trae algunos <br>; normalizamos y escapamos el resto.
  const parts = String(s)
    .split(/<br\s*\/?>|\n{2,}/i)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.map((p) => `<p>${esc(p)}</p>`).join("");
}

export function modalidadLabel(m) {
  const map = { ead: "A distancia (EAD)", presencial: "Presencial", hibrido: "Híbrido" };
  return map[(m || "").toLowerCase()] || "A distancia";
}

// ---------------------------------------------------------------------------
// Áreas de estudio — clasificación derivada del NOMBRE real del curso.
// No inventa datos: agrupa el catálogo existente en áreas para filtrar/mostrar.
// Cada área tiene un tono (hue) para pintar la "portada" de la card en dorado.
// ---------------------------------------------------------------------------
export const AREAS = [
  { key: "tecnologia", label: "Tecnología", icon: "monitor", re: /comput|inform|software|program|sistem|redes|hardware|tecnolog|reparaci|mantenim|herramientas tecnol/i },
  { key: "diseno", label: "Diseño y Marketing", icon: "palette", re: /dise|gráfic|grafic|photoshop|marketing|publicid|propaganda/i },
  { key: "administracion", label: "Administración", icon: "briefcase", re: /secretar|administ|banc|cajer|contab|recursos|prevision|jurídic|juridic|person|lideraz/i },
  { key: "salud", label: "Salud y Forense", icon: "heart-pulse", re: /salud|enferm|farmac|funerar|tanato|necropsia|forense|perito|papilosco|socorrista|aph|médic|medic|estétic|estetic|belleza/i },
  { key: "tecnico", label: "Técnico e Industria", icon: "wrench", re: /electr|mecán|mecanic|técnic|tecnic|manten|repar|máquinas|maquinas|pesad|ingeniería|ingenieria|arquitect/i },
  { key: "negocios", label: "Negocios", icon: "trending-up", re: /negoci|empren|business|ventas|persuas|financ|corporativ|productividad|rendimiento|startup|mentoria|mentoría|carrera|policial|concurso|eja|formación profesional|formacion profesional/i },
  { key: "idiomas", label: "Idiomas", icon: "languages", re: /idioma|inglés|ingles|portug|español|espanol/i },
];

/** Devuelve el área (objeto de AREAS) que corresponde al curso. */
export function cursoArea(nome = "") {
  const n = String(nome);
  for (const a of AREAS) if (a.re.test(n)) return a;
  return { key: "otros", label: "General", icon: "graduation-cap" };
}

/** Nombre del ícono (para icons.js) según el curso. */
export function cursoIcon(nome = "") {
  return cursoArea(nome).icon;
}

/** Texto plano (sin <br>/tags) recortado a n caracteres, para excerpts. */
export function excerpt(s, n = 120) {
  if (!s) return "";
  const plain = String(s)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= n) return plain;
  return plain.slice(0, n).replace(/\s+\S*$/, "") + "…";
}
