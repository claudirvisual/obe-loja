// ============================================================================
// OBE Informática — Vitrine · Router SPA (hash) + vistas
// ============================================================================
import { CONFIG } from "./config.js";
import { fetchCursos, fetchCurso, submitLead, leadWhatsAppUrl } from "./data.js";
import {
  esc,
  gs,
  precioCurso,
  richText,
  modalidadLabel,
  cursoIcon,
  cursoArea,
  excerpt,
  AREAS,
  miles,
} from "./ui.js";
import { icon } from "./icons.js";

// Fila de estrellas (SVG) para la prueba visual.
const STARS = Array.from({ length: 5 }, () => icon("star", { size: 16, cls: "star-ic" })).join("");

const app = document.getElementById("app");

// Filtro pendiente al navegar desde el buscador de la home hacia el catálogo.
const pendingFilter = { q: "", area: "" };

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
const routes = {
  "": viewHome,
  home: viewHome,
  cursos: viewCatalogo,
  curso: viewCurso, // #/curso/<id>
  inscripcion: viewInscripcion, // #/inscripcion/<id?>
};

async function router() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [name, ...params] = hash.split("/");
  const view = routes[name] || viewHome;
  window.scrollTo(0, 0);
  setActiveNav(name || "home");
  app.innerHTML = spinner();
  try {
    await view(params);
    initReveal();
    initCounters();
  } catch (err) {
    app.innerHTML = errorBox(err);
  }
}

// --- Enlace de WhatsApp con mensaje prellenado (o null si no hay número) ----
function waLink(text) {
  if (!CONFIG.WHATSAPP_NUMBER) return null;
  const msg = encodeURIComponent(text || "Hola, quiero información sobre los cursos.");
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`;
}

// --- Animación de aparición al hacer scroll --------------------------------
let _io;
function initReveal() {
  if (_io) _io.disconnect();
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  _io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          _io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((e) => _io.observe(e));
}

// --- Contadores animados (elementos con data-count) ------------------------
function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  const run = (el) => {
    const target = Number(el.dataset.count) || 0;
    const dur = 1200;
    let start = null;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(p * target).toLocaleString("es-PY");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!("IntersectionObserver" in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          run(en.target);
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((n) => io.observe(n));
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  buildChrome();
  router();
});

// ---------------------------------------------------------------------------
// Chrome (header + footer)
// ---------------------------------------------------------------------------
function buildChrome() {
  const waHeader = CONFIG.WHATSAPP_NUMBER
    ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hola, quiero información sobre los cursos de OBE Informática."
      )}`
    : null;

  document.getElementById("site-header").innerHTML = `
    <div class="wrap header-inner">
      <a class="brand" href="#/home">
        <img src="assets/img/logo.jpg" alt="OBE Informática" />
      </a>
      <button class="nav-toggle" aria-label="Menú" onclick="document.body.classList.toggle('nav-open')">${icon("menu", { size: 24 })}</button>
      <nav class="nav">
        <a data-nav="home" href="#/home">Inicio</a>
        <a data-nav="cursos" href="#/cursos">Cursos</a>
        <a href="#/home#quienes">Quiénes somos</a>
        <a href="#/home#faq">Preguntas</a>
        <span class="nav-actions">
          <a class="btn btn-ghost btn-sm" href="${CONFIG.URL_ALUMNOS}" target="_blank" rel="noopener">Área del alumno ↗</a>
          ${
            waHeader
              ? `<a class="btn btn-wa btn-sm" href="${waHeader}" target="_blank" rel="noopener">${icon("whatsapp", { size: 18 })} WhatsApp</a>`
              : ""
          }
          <a class="btn btn-primary btn-sm" href="#/inscripcion">Inscribite</a>
        </span>
      </nav>
    </div>`;

  const waFoot = CONFIG.WHATSAPP_NUMBER ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}` : null;
  const social = [
    waFoot ? `<a class="soc" href="${waFoot}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("whatsapp", { size: 18 })}</a>` : "",
    CONFIG.INSTAGRAM_URL
      ? `<a class="soc" href="${CONFIG.INSTAGRAM_URL}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram", { size: 18 })}</a>`
      : "",
    CONFIG.EMAIL_CONTACTO ? `<a class="soc" href="mailto:${CONFIG.EMAIL_CONTACTO}" aria-label="Correo">${icon("mail", { size: 18 })}</a>` : "",
    CONFIG.TELEFONO
      ? `<a class="soc" href="tel:${CONFIG.TELEFONO.replace(/\s/g, "")}" aria-label="Teléfono">${icon("phone", { size: 18 })}</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const contactos = [
    CONFIG.DIRECCION ? `<span class="foot-link muted">${icon("map-pin", { size: 16, cls: "fl-ic" })} ${esc(CONFIG.DIRECCION)}</span>` : "",
    CONFIG.TELEFONO ? `<a class="foot-link" href="tel:${CONFIG.TELEFONO.replace(/\s/g, "")}">${icon("phone", { size: 16, cls: "fl-ic" })} ${esc(CONFIG.TELEFONO)}</a>` : "",
    CONFIG.EMAIL_CONTACTO ? `<a class="foot-link" href="mailto:${CONFIG.EMAIL_CONTACTO}">${icon("mail", { size: 16, cls: "fl-ic" })} ${esc(CONFIG.EMAIL_CONTACTO)}</a>` : "",
  ]
    .filter(Boolean)
    .join("");

  document.getElementById("site-footer").innerHTML = `
    <div class="wrap foot-inner">
      <div class="foot-brand">
        <img class="foot-logo" src="assets/img/logo.jpg" alt="OBE Informática" />
        <p class="muted">Formación profesional · Paraguay</p>
        <p class="muted">Pago por carné, en cuotas · Guaraníes</p>
        ${social ? `<div class="foot-social">${social}</div>` : ""}
      </div>
      <div class="foot-cols">
        <div>
          <h4>Navegación</h4>
          <a class="foot-link" href="#/cursos">Todos los cursos</a>
          <a class="foot-link" href="#/home#quienes">Quiénes somos</a>
          <a class="foot-link" href="#/home#faq">Preguntas frecuentes</a>
          <a class="foot-link" href="#/inscripcion">Inscribite</a>
        </div>
        <div>
          <h4>Sistema</h4>
          <a class="foot-link" href="${CONFIG.URL_ALUMNOS}" target="_blank" rel="noopener">Área del alumno</a>
          <a class="foot-link" href="${CONFIG.URL_PANEL}" target="_blank" rel="noopener">Panel / Sistema</a>
        </div>
        <div>
          <h4>Contacto</h4>
          ${contactos || '<span class="muted">Próximamente</span>'}
        </div>
      </div>
    </div>
    ${aliadosFooter()}
    <div class="wrap foot-copy muted">© ${YEAR()} OBE Informática · Todos los derechos reservados</div>`;

  buildFloating(waFoot);
}

// Franja de aliados/certificaciones en el footer (placeholder gestionable).
function aliadosFooter() {
  if (CONFIG.MOSTRAR_PLACEHOLDERS === false) return "";
  const items = CONFIG.ALIADOS || [];
  if (!items.length) return "";
  return `<div class="wrap foot-aliados">
    <span class="foot-aliados-label">${ejemploBadge()} Aliados y certificaciones</span>
    <div class="aliados-row">
      ${items
        .map(
          (a) => `<span class="aliado-chip" title="${esc(a.nombre)}">${esc(a.nombre)}</span>`
        )
        .join("")}
    </div>
  </div>`;
}

// Sello reutilizable para marcar contenido de ejemplo.
function ejemploBadge() {
  return CONFIG.MOSTRAR_PLACEHOLDERS === false
    ? ""
    : `<span class="ej-badge">Contenido de ejemplo</span>`;
}

// Botones flotantes: WhatsApp (si hay número) + volver arriba
function buildFloating(waHref) {
  if (document.getElementById("floating")) return;
  const box = document.createElement("div");
  box.id = "floating";
  box.innerHTML = `
    ${
      waHref
        ? `<a class="fab fab-wa" href="${waHref}?text=${encodeURIComponent(
            "Hola, quiero información sobre los cursos de OBE Informática."
          )}" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" width="28" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.2c-.25.7-1.44 1.33-1.99 1.36-.51.03-.51.4-3.21-.67-2.7-1.07-4.43-3.8-4.56-3.98-.13-.18-1.1-1.46-1.1-2.79 0-1.33.7-1.98.94-2.25.25-.27.54-.34.72-.34.18 0 .36 0 .52.01.17.01.39-.06.61.47.22.53.76 1.85.83 1.98.07.13.11.29.02.47-.09.18-.13.29-.27.44-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.27.67 1.11 1.44 1.79.99.88 1.83 1.15 2.09 1.28.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.27.35-.22.59-.13.24.09 1.52.72 1.78.85.26.13.43.2.5.31.06.11.06.63-.19 1.33z"/></svg>
          </a>`
        : ""
    }
    <button class="fab fab-top" id="toTop" aria-label="Volver arriba">↑</button>`;
  document.body.appendChild(box);
  const toTop = box.querySelector("#toTop");
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    box.classList.toggle("show-top", window.scrollY > 500);
  });
}

// new Date() no está disponible en el harness de build, pero sí en el navegador.
function YEAR() {
  try {
    return new Date().getFullYear();
  } catch {
    return "";
  }
}

function setActiveNav(name) {
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === name);
  });
  document.body.classList.remove("nav-open");
}

// Desplaza a un ancla (#quienes/#faq) tras render de la home.
function scrollToAnchor() {
  const m = location.hash.match(/#\/home#(\w+)/);
  if (!m) return;
  const el = document.getElementById(m[1]);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
}

// ---------------------------------------------------------------------------
// Vista: Home
// ---------------------------------------------------------------------------
async function viewHome() {
  const cursos = await fetchCursos();
  const populares = cursos.slice(0, 6);
  const wa = waLink("Hola, quiero información sobre los cursos de OBE Informática.");
  const ctaSecundario = wa
    ? `<a class="btn btn-wa btn-lg" href="${wa}" target="_blank" rel="noopener">${icon("whatsapp", { size: 20 })} Consultá por WhatsApp</a>`
    : `<a class="btn btn-ghost btn-lg" href="#/inscripcion">Solicitá información</a>`;

  app.innerHTML = `
    <section class="hero">
      <div class="wrap hero-inner">
        <div class="hero-copy reveal">
          <span class="pill">${icon("graduation-cap", { size: 16, cls: "pill-ic" })} Formación profesional · Certificado incluido</span>
          <h1>Transformá tu vida <span class="hl">estudiando</span> desde cualquier lugar del Paraguay</h1>
          <p class="lead">
            Cursos con certificado, pensados para el mercado laboral paraguayo.
            Pagás cómodamente <strong>por carné, en cuotas</strong>.
          </p>
          <div class="hero-cta">
            <a class="btn btn-primary btn-lg" href="#/cursos">Ver los ${cursos.length} cursos</a>
            ${ctaSecundario}
          </div>
          <div class="hero-proof">
            <span class="stars" aria-hidden="true">${STARS}</span>
            <span>Formación profesional en Paraguay · Certificado incluido</span>
          </div>
        </div>
        <div class="hero-art reveal" aria-hidden="true">
          <div class="ha-glow"></div>
          <div class="ha-card ha-benefits">
            <div class="ha-benefits-head">
              <span class="ha-ic">${icon("graduation-cap", { size: 24 })}</span>
              <div class="ha-benefits-title"><strong>OBE Informática</strong><small>Formación profesional</small></div>
            </div>
            <ul class="ha-list">
              ${HERO_BENEFITS.map(
                (b) => `<li><span class="ha-check">${icon("check", { size: 16 })}</span> ${b}</li>`
              ).join("")}
            </ul>
          </div>
          <div class="ha-card ha-mini ha-mini-mod">
            <span class="ha-mini-ic">${icon("monitor", { size: 18 })}</span> A distancia y presencial
          </div>
          <div class="ha-badge-gs">Gs</div>
        </div>
      </div>
      <div class="hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0,64 C240,90 480,20 720,32 C960,44 1200,96 1440,64 L1440,90 L0,90 Z" fill="var(--bg)"/></svg>
      </div>
    </section>

    ${searchbar()}

    ${statsStrip(cursos.length)}

    ${areasSection(cursos)}

    <section class="strip-alt">
      <div class="wrap section">
        <div class="section-head center reveal">
          <span class="eyebrow">Empezá hoy</span>
          <h2>Nuestros cursos más buscados</h2>
          <p class="muted">Elegí una formación y te ayudamos a coordinar el pago por carné.</p>
        </div>
        <div class="grid cards">
          ${populares.map((c) => `<div class="reveal">${cardCurso(c)}</div>`).join("")}
        </div>
        <div class="center-btn reveal">
          <a class="btn btn-primary btn-lg" href="#/cursos">Ver todos los ${cursos.length} cursos →</a>
        </div>
      </div>
    </section>

    <section class="wrap section" id="por-que">
      <div class="section-head center reveal">
        <span class="eyebrow">¿Por qué OBE?</span>
        <h2>Una formación pensada para vos</h2>
      </div>
      <div class="grid features">
        ${WHY.map(
          (f) => `<article class="feature reveal"><div class="feature-ic">${icon(f.ic, { size: 24 })}</div>
            <h3>${f.t}</h3><p>${f.d}</p></article>`
        ).join("")}
      </div>
    </section>

    <section class="wrap section">
      <div class="section-head center reveal">
        <span class="eyebrow">Simple y claro</span>
        <h2>Cómo funciona</h2>
      </div>
      <div class="grid steps">
        ${STEPS.map(
          (s, i) => `<div class="step reveal"><span class="step-num">${i + 1}</span>
            <h3>${s.t}</h3><p>${s.d}</p></div>`
        ).join("")}
      </div>
    </section>

    ${quienesSomosSection()}

    ${testimoniosSection()}

    <section class="wrap section narrow" id="faq">
      <div class="section-head center reveal">
        <span class="eyebrow">Dudas frecuentes</span>
        <h2>Preguntas y respuestas</h2>
      </div>
      <div class="faq reveal">
        ${FAQ.map(
          (q) => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-body"><p>${q.a}</p></div></details>`
        ).join("")}
      </div>
    </section>

    <section class="cta-band">
      <div class="wrap cta-inner reveal">
        <div>
          <h2>¿Listo para empezar tu curso?</h2>
          <p>Dejanos tus datos o escribinos. Te ayudamos a elegir y coordinar el pago por carné.</p>
        </div>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="#/inscripcion">Inscribite ahora</a>
          ${wa ? `<a class="btn btn-white btn-lg" href="${wa}" target="_blank" rel="noopener">${icon("whatsapp", { size: 20 })} WhatsApp</a>` : ""}
        </div>
      </div>
    </section>`;

  wireSearchbar();
  scrollToAnchor();
}

// --- Buscador destacado (estilo "Encontrá tu curso") -----------------------
function searchbar() {
  return `<div class="wrap searchbar-wrap reveal">
    <form id="home-search" class="searchbar">
      <span class="searchbar-ic" aria-hidden="true">${icon("search", { size: 20 })}</span>
      <input id="home-q" class="searchbar-input" type="search" placeholder="Encontrá tu curso… (ej: informática, secretariado, diseño)" autocomplete="off" />
      <button type="submit" class="btn btn-primary">Buscar</button>
    </form>
  </div>`;
}

function wireSearchbar() {
  const form = document.getElementById("home-search");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    pendingFilter.q = document.getElementById("home-q").value.trim();
    pendingFilter.area = "";
    location.hash = "#/cursos";
  });
}

// --- Contenido estático de la home -----------------------------------------
// Beneficios que se muestran en la tarjeta del hero (distintos, sin repetir).
const HERO_BENEFITS = [
  "Certificado incluido",
  "Pago por carné, en cuotas",
  "Docentes del área",
];

const WHY = [
  { ic: "award", t: "Certificado incluido", d: "Recibí tu certificado al finalizar el curso." },
  { ic: "wallet", t: "Pago por carné", d: "Cuotas accesibles en Guaraníes, sin tarjeta ni pago online." },
  { ic: "users", t: "Docentes del área", d: "Aprendé con profesionales que enseñan lo que hacen." },
  { ic: "laptop", t: "Formación práctica", d: "Contenido orientado al mercado laboral paraguayo." },
  { ic: "clock", t: "Horarios flexibles", d: "Cursos presenciales y a distancia, a tu ritmo." },
  { ic: "badge-check", t: "Acompañamiento", d: "Te guiamos desde la inscripción hasta el certificado." },
];

const STEPS = [
  { t: "Elegí tu curso", d: "Mirá el catálogo y elegí la formación que buscás." },
  { t: "Inscribite", d: "Completá tus datos o escribinos por WhatsApp." },
  { t: "Pagá por carné", d: "Coordinamos el pago en cuotas, en Guaraníes." },
  { t: "Estudiá y certificate", d: "Cursás y al terminar recibís tu certificado." },
];

const FAQ = [
  {
    q: "¿Cómo puedo pagar?",
    a: "El pago es exclusivamente por carné, en cuotas y en Guaraníes. No se realiza ningún pago en línea: coordinamos todo con vos al momento de inscribirte.",
  },
  {
    q: "¿Los cursos son presenciales o a distancia?",
    a: "Depende del curso: tenemos cursos presenciales y a distancia. En cada curso indicamos la modalidad.",
  },
  {
    q: "¿Recibo un certificado?",
    a: "Sí. Al finalizar tu curso recibís un certificado que acredita la formación realizada.",
  },
  {
    q: "¿Necesito conocimientos previos?",
    a: "No. Nuestros cursos están pensados para empezar desde cero, con acompañamiento durante todo el proceso.",
  },
  {
    q: "¿Cómo me inscribo?",
    a: "Completá el formulario de inscripción o escribinos por WhatsApp. Te contactamos para coordinar todo.",
  },
];

// --- Áreas de estudio (pills que filtran el catálogo) ----------------------
function areasSection(cursos) {
  const counts = {};
  cursos.forEach((c) => {
    const k = cursoArea(c.nome).key;
    counts[k] = (counts[k] || 0) + 1;
  });
  const areas = AREAS.filter((a) => counts[a.key]);
  if (!areas.length) return "";
  return `<section class="wrap section" id="areas">
    <div class="section-head center reveal">
      <span class="eyebrow">Elegí tu camino</span>
      <h2>¿Cómo querés cambiar tu vida?</h2>
      <p class="muted">Explorá nuestras áreas de formación.</p>
    </div>
    <div class="areas-grid reveal">
      ${areas
        .map(
          (a) => `<a class="area-pill" href="#/cursos/${a.key}">
            <span class="area-ic">${icon(a.icon, { size: 24 })}</span>
            <span class="area-txt"><strong>${esc(a.label)}</strong>
              <small>${counts[a.key]} curso${counts[a.key] > 1 ? "s" : ""}</small></span>
            <span class="area-arrow">${icon("arrow-right", { size: 18 })}</span>
          </a>`
        )
        .join("")}
    </div>
  </section>`;
}

// --- Stats band -------------------------------------------------------------
function statsStrip(nCursos) {
  const sp = CONFIG.SOCIAL_PROOF || {};
  const items = [];
  if (sp.anos) items.push({ n: sp.anos, s: "+", l: "años de experiencia" });
  if (sp.alumnos) items.push({ n: sp.alumnos, s: "+", l: "alumnos" });
  items.push({ n: nCursos, s: "", l: "cursos disponibles" });
  if (sp.docentes) items.push({ n: sp.docentes, s: "", l: "docentes" });
  return `<section class="stats"><div class="wrap stats-inner reveal">
    ${items
      .map(
        (it) =>
          `<div class="stat"><span class="stat-num"><span data-count="${it.n}">0</span>${it.s}</span><span class="stat-label">${it.l}</span></div>`
      )
      .join("")}
  </div></section>`;
}

// --- ¿Quiénes somos? (texto + galería placeholder) -------------------------
function quienesSomosSection() {
  const q = CONFIG.QUIENES_SOMOS;
  if (CONFIG.MOSTRAR_PLACEHOLDERS === false || !q || !(q.parrafos || []).length) return "";
  const n = Math.max(0, q.galeria_placeholders || 0);
  const gallery = n
    ? `<div class="qs-gallery reveal" aria-hidden="true">
        ${Array.from({ length: n })
          .map(() => `<div class="qs-photo"><span>${icon("image", { size: 26 })}</span><small>Foto — a completar</small></div>`)
          .join("")}
      </div>`
    : "";
  return `<section class="strip-alt" id="quienes"><div class="wrap section">
    <div class="qs-grid">
      <div class="qs-copy reveal">
        <span class="eyebrow">${ejemploBadge()} Nosotros</span>
        <h2>${esc(q.titulo || "¿Quiénes somos?")}</h2>
        ${(q.parrafos || []).map((p) => `<p class="muted">${esc(p)}</p>`).join("")}
        <a class="btn btn-primary" href="#/inscripcion">Quiero más información</a>
      </div>
      ${gallery}
    </div>
  </div></section>`;
}

// --- Testimonios (placeholder gestionable) ---------------------------------
function testimoniosSection() {
  const t = CONFIG.TESTIMONIOS || [];
  if (CONFIG.MOSTRAR_PLACEHOLDERS === false || !t.length) return "";
  return `<section class="wrap section">
    <div class="section-head center reveal">
      <span class="eyebrow">${ejemploBadge()} Quienes estudian, recomiendan</span>
      <h2>Lo que dicen nuestros alumnos</h2>
    </div>
    <div class="grid testimonios">
      ${t
        .map(
          (x) => `<figure class="testimonio reveal">
          <div class="stars" aria-hidden="true">${STARS}</div>
          <blockquote>${esc(x.texto)}</blockquote>
          <figcaption><span class="avatar">${esc((x.nombre || "?").slice(0, 1))}</span>
            <div><strong>${esc(x.nombre || "")}</strong><small>${esc(x.ciudad || "")}</small></div>
          </figcaption>
        </figure>`
        )
        .join("")}
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
// Vista: Catálogo
// ---------------------------------------------------------------------------
async function viewCatalogo([areaKey]) {
  const cursos = await fetchCursos();
  const area = areaKey ? AREAS.find((a) => a.key === areaKey) : null;
  const q0 = pendingFilter.q || "";
  pendingFilter.q = ""; // consumido

  const chips = [
    `<a class="fchip ${!area ? "on" : ""}" href="#/cursos">Todas las áreas</a>`,
    ...AREAS.map(
      (a) => `<a class="fchip ${area && area.key === a.key ? "on" : ""}" href="#/cursos/${a.key}">${icon(a.icon, { size: 16, cls: "fchip-ic" })} ${esc(a.label)}</a>`
    ),
  ].join("");

  app.innerHTML = `
    <section class="wrap section">
      <div class="page-head">
        <h1>${area ? esc(area.label) : "Nuestros cursos"}</h1>
        <p class="muted">${cursos.length} cursos de formación profesional. Pago por carné, en cuotas.</p>
      </div>
      <div class="fchips reveal">${chips}</div>
      <div class="toolbar">
        <input id="buscar" class="input" type="search" placeholder="Buscar curso…" autocomplete="off" value="${esc(q0)}" />
        <span id="contador" class="muted"></span>
      </div>
      <div id="lista" class="grid cards"></div>
      <div id="vacio" class="empty" hidden>No encontramos cursos con ese nombre.</div>
    </section>`;

  const input = document.getElementById("buscar");
  const lista = document.getElementById("lista");
  const vacio = document.getElementById("vacio");
  const contador = document.getElementById("contador");

  const upd = () => {
    const q = input.value.trim().toLowerCase();
    const filtrados = cursos.filter((c) => {
      const okArea = !area || cursoArea(c.nome).key === area.key;
      const okQ = !q || (c.nome || "").toLowerCase().includes(q);
      return okArea && okQ;
    });
    lista.innerHTML = filtrados.map(cardCurso).join("");
    vacio.hidden = filtrados.length > 0;
    contador.textContent = `${filtrados.length} de ${cursos.length}`;
    initReveal();
  };
  input.addEventListener("input", upd);
  upd();
}

// ---------------------------------------------------------------------------
// Vista: Detalle de curso
// ---------------------------------------------------------------------------
async function viewCurso([id]) {
  const c = await fetchCurso(id);
  if (!c) {
    app.innerHTML = errorBox("El curso solicitado no existe.");
    return;
  }
  const a = cursoArea(c.nome);
  const p = precioCurso(c);
  const chipIc = (name) => icon(name, { size: 16, cls: "chip-ic" });
  const meta = [
    c.duracao_meses ? `${chipIc("clock")} ${c.duracao_meses} meses` : null,
    c.carga_horaria ? `${chipIc("book-open")} ${c.carga_horaria} h` : null,
    `${chipIc("monitor")} ${modalidadLabel(c.modalidade)}`,
    c.qtd_certificados ? `${chipIc("award")} ${c.qtd_certificados} certificado(s)` : null,
  ].filter(Boolean);

  app.innerHTML = `
    <section class="wrap breadcrumb">
      <a href="#/cursos">← Volver a los cursos</a>
    </section>
    <section class="wrap curso-detalle">
      <div class="curso-main">
        <div class="curso-hero">
          <div class="curso-ic">${icon(a.icon, { size: 32 })}</div>
          <div>
            <span class="tag">${esc(a.label)}</span>
            <h1>${esc(c.nome)}</h1>
            <div class="meta-row">${meta.map((m) => `<span class="chip">${m}</span>`).join("")}</div>
          </div>
        </div>
        ${c.descricao ? `<div class="prose">${richText(c.descricao)}</div>` : ""}
        ${block("¿Qué vas a estudiar?", c.o_que_estuda)}
        ${block("Contenido del curso", c.ementa)}
      </div>

      <aside class="curso-side">
        <div class="price-card">
          <span class="price-label">${p.disponible ? "Inversión" : "Precio"}</span>
          <div class="price-main">${esc(p.titulo)}</div>
          ${p.total ? `<div class="price-sub">${esc(p.total)}</div>` : ""}
          ${p.contado ? `<div class="price-sub">${esc(p.contado)}</div>` : ""}
          <div class="price-note">${icon("wallet", { size: 16, cls: "pn-ic" })} Pago por carné, en cuotas · Guaraníes</div>
          <a class="btn btn-primary btn-block" href="#/inscripcion/${encodeURIComponent(c.id)}">Inscribite ahora</a>
          ${
            CONFIG.WHATSAPP_NUMBER
              ? `<a class="btn btn-wa btn-block" target="_blank" rel="noopener"
                   href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hola, quiero información sobre el curso " + c.nome
                  )}">${icon("whatsapp", { size: 18 })} Consultá por WhatsApp</a>`
              : `<a class="btn btn-ghost btn-block" href="#/inscripcion/${encodeURIComponent(c.id)}">Solicitá información</a>`
          }
        </div>
      </aside>
    </section>`;
}

function block(titulo, contenido) {
  if (!contenido) return "";
  return `<section class="curso-block">
    <h2>${esc(titulo)}</h2>
    <div class="prose">${richText(contenido)}</div>
  </section>`;
}

// ---------------------------------------------------------------------------
// Vista: Inscripción / Solicitud (lead)
// ---------------------------------------------------------------------------
async function viewInscripcion([id]) {
  const cursos = await fetchCursos();
  const presel = id ? cursos.find((c) => c.id === id) : null;
  const options = cursos
    .map(
      (c) =>
        `<option value="${esc(c.nome)}" ${presel && presel.id === c.id ? "selected" : ""}>${esc(
          c.nome
        )}</option>`
    )
    .join("");

  app.innerHTML = `
    <section class="wrap section narrow">
      <div class="page-head">
        <h1>Solicitá tu inscripción</h1>
        <p class="muted">Dejanos tus datos y te contactamos para coordinar el pago por carné y comenzar el curso.</p>
      </div>
      <form id="lead-form" class="form card">
        <div class="field">
          <label for="f-nombre">Nombre y apellido *</label>
          <input id="f-nombre" name="nombre" class="input" required autocomplete="name" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="f-tel">Teléfono / WhatsApp *</label>
            <input id="f-tel" name="telefono" class="input" required inputmode="tel" autocomplete="tel" placeholder="09xx xxx xxx" />
          </div>
          <div class="field">
            <label for="f-email">Correo electrónico</label>
            <input id="f-email" name="email" class="input" type="email" autocomplete="email" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="f-curso">Curso de interés *</label>
            <select id="f-curso" name="curso" class="input" required>
              <option value="" disabled ${presel ? "" : "selected"}>Elegí un curso…</option>
              ${options}
            </select>
          </div>
          <div class="field">
            <label for="f-doc">Cédula (CI)</label>
            <input id="f-doc" name="documento" class="input" inputmode="numeric" autocomplete="off" />
          </div>
        </div>
        <div class="field">
          <label for="f-msg">Mensaje (opcional)</label>
          <textarea id="f-msg" name="mensaje" class="input" rows="3" placeholder="Contanos tu consulta…"></textarea>
        </div>
        <p class="fineprint muted">Al enviar aceptás que OBE Informática te contacte por este medio. No se realiza ningún pago en línea.</p>
        <button type="submit" class="btn btn-primary btn-block" id="f-submit">Enviar solicitud</button>
        <div id="f-status" class="form-status" hidden></div>
      </form>
    </section>`;

  const form = document.getElementById("lead-form");
  const status = document.getElementById("f-status");
  const submit = document.getElementById("f-submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.hidden = true;
    const fd = new FormData(form);
    const lead = Object.fromEntries(fd.entries());

    // Modo WhatsApp: abrimos el chat con la solicitud ya formateada.
    // Se hace de forma síncrona (sin await previo) para no perder el gesto
    // del usuario y evitar el bloqueo de pop-ups.
    if (CONFIG.LEAD_MODE === "whatsapp") {
      const url = leadWhatsAppUrl(lead);
      if (url) window.open(url, "_blank", "noopener");
      form.innerHTML = `
        <div class="success">
          <div class="success-ic">${icon("check-circle", { size: 56 })}</div>
          <h2>¡Ya casi está!</h2>
          <p>Abrimos <strong>WhatsApp</strong> con tu solicitud para el curso
             <strong>${esc(lead.curso)}</strong>. Envianos ese mensaje y te
             contactamos para coordinar tu inscripción.</p>
          ${
            url
              ? `<a class="btn btn-primary" href="${url}" target="_blank" rel="noopener">Abrir WhatsApp</a>`
              : ""
          }
          <a class="btn btn-ghost" href="#/cursos">Ver más cursos</a>
        </div>`;
      return;
    }

    submit.disabled = true;
    submit.textContent = "Enviando…";
    const r = await submitLead(lead);
    if (r.ok) {
      form.innerHTML = `
        <div class="success">
          <div class="success-ic">${icon("check-circle", { size: 56 })}</div>
          <h2>¡Solicitud enviada!</h2>
          <p>Gracias, <strong>${esc(lead.nombre)}</strong>. Te vamos a contactar a la brevedad
             para coordinar tu inscripción al curso <strong>${esc(lead.curso)}</strong>.</p>
          <a class="btn btn-ghost" href="#/cursos">Ver más cursos</a>
        </div>`;
    } else {
      submit.disabled = false;
      submit.textContent = "Enviar solicitud";
      status.hidden = false;
      status.className = "form-status err";
      status.innerHTML = `No pudimos enviar tu solicitud automáticamente.${
        CONFIG.WHATSAPP_NUMBER
          ? ` Escribinos por <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}" target="_blank" rel="noopener">WhatsApp</a>.`
          : " Por favor, intentá de nuevo en unos minutos."
      }`;
      console.warn("submitLead falló:", r.detail);
    }
  });
}

// ---------------------------------------------------------------------------
// Componentes
// ---------------------------------------------------------------------------
function cardCurso(c) {
  const a = cursoArea(c.nome);
  const p = precioCurso(c);
  const dur = c.duracao_meses ? `${c.duracao_meses} meses` : "";
  const ch = c.carga_horaria ? `${c.carga_horaria} h` : "";
  const sub = [dur, ch].filter(Boolean).join(" · ");
  const desc = excerpt(c.descricao || c.o_que_estuda, 92);
  return `
    <a class="card curso-card" href="#/curso/${encodeURIComponent(c.id)}">
      <div class="curso-media">
        <span class="curso-media-ic">${icon(a.icon, { size: 26 })}</span>
        <span class="curso-media-area">${esc(a.label)}</span>
        <span class="tag curso-media-tag">${modalidadLabel(c.modalidade)}</span>
      </div>
      <div class="curso-body">
        <h3>${esc(c.nome)}</h3>
        ${sub ? `<p class="card-sub muted">${esc(sub)}</p>` : ""}
        ${desc ? `<p class="card-desc muted">${esc(desc)}</p>` : ""}
        <div class="card-foot">
          <span class="card-price ${p.disponible ? "" : "consult"}">${esc(p.titulo)}</span>
          <span class="card-btn">Ver más ${icon("arrow-right", { size: 16 })}</span>
        </div>
      </div>
    </a>`;
}

function spinner() {
  return `<div class="loader"><div class="spin"></div><p class="muted">Cargando…</p></div>`;
}

function errorBox(err) {
  return `<div class="wrap section">
    <div class="empty error">
      <h2>Ups, algo salió mal</h2>
      <p class="muted">${esc(String(err && err.message ? err.message : err))}</p>
      <a class="btn btn-ghost" href="#/home">Volver al inicio</a>
    </div>
  </div>`;
}
