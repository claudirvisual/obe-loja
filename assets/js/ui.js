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

/** Icono/emoji simple según palabra clave del nombre del curso. */
export function cursoIcon(nome = "") {
  const n = nome.toLowerCase();
  const rules = [
    [/comput|inform|software|program|sistem|redes|hardware/, "💻"],
    [/dise|gráfic|grafic|photoshop|marketing|publicid/, "🎨"],
    [/secretar|administ|banc|cajer|contab|recursos/, "🗂️"],
    [/salud|enferm|farmac|funerar|tanato|estétic|estetic|belleza/, "🩺"],
    [/electr|mecán|mecanic|técnic|tecnic|manten|repar/, "🔧"],
    [/gastro|cocina|panad|reposter/, "🍽️"],
    [/idioma|inglés|ingles|portug/, "🗣️"],
  ];
  for (const [re, ic] of rules) if (re.test(n)) return ic;
  return "🎓";
}
