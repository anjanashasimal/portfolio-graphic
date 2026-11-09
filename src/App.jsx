import { useState, useRef, useEffect } from "react";
import "./App.css";
import cutout from "./hero-cutout.webp";
/* ------------------------------------------------------------------
   Edit everything below to match your real work.

   ADDING WORK: drop image files (jpg / png / webp) into the matching folder
   and they appear on the site automatically, sorted by file name:
     src/posters    -> Film Posters        src/posts     -> Posts
     src/logos      -> Logos               src/videos    -> Videos (thumbnails)
     src/animation  -> Animation
   The title comes from the file name ("cafe-logo.jpg" -> "Cafe logo").
   For a nicer title or a link (YouTube, Behance, Drive), add the file
   name to WORK_DETAILS below. Without a link, the card opens the image.
   A category with an empty folder shows the sample cards in SAMPLES.
------------------------------------------------------------------- */

const PROFILE = {
  name: "Anjana Bandara",
  short: "Anjana",
  years: 6,
  phone: "0772790502",
  phoneIntl: "94772790502",
  email: "anjanashasimal@gmail.com",
};

const SERVICES = ["Video editing", "Animation", "Graphic design", "Logo design"];

const CATEGORIES = ["All", "Film Posters", "Logos", "Posts", "Videos", "Animation"];

// Vite needs literal glob strings, so each folder is listed out.
const FOLDERS = {
  "Film Posters": import.meta.glob("./posters/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" }),
  Logos: import.meta.glob("./logos/*.{jpg,jpeg,png,webp,svg}", { eager: true, import: "default" }),
  Posts: import.meta.glob("./posts/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" }),
  Videos: import.meta.glob("./videos/*.{jpg,jpeg,png,webp}", { eager: true, import: "default" }),
  Animation: import.meta.glob("./animation/*.{jpg,jpeg,png,webp,gif}", { eager: true, import: "default" }),
};

// Per-category defaults for cards made from folder images.
const CATEGORY_INFO = {
  "Film Posters": { tools: "Photoshop", size: "poster" },
  Logos: { tools: "Illustrator", size: "sq" },
  Posts: { tools: "Photoshop", size: "sq" },
  Videos: { tools: "Premiere Pro", size: "wide" },
  Animation: { tools: "After Effects", size: "sq" },
};

// Optional: nicer titles, tools or links, keyed by file name.
const WORK_DETAILS = {
  "rani-1.jpg": { title: "Rani: Queen without her prince" },
  "rani-2.jpg": { title: "Rani: three faces" },
  "rani-3.jpg": { title: "Rani: scales of justice" },
  "rani-4.jpg": { title: "Rani: the queen piece" },
  // "my-reel.jpg": { title: "Product launch reel", link: "https://youtu.be/..." },
};

// Placeholder cards, shown only while a category's folder is empty.
const SAMPLES = [
  { title: "Brand identity for a café", category: "Logos", tools: "Illustrator", size: "tall", tone: "ember" },
  { title: "Clothing brand logo", category: "Logos", tools: "Illustrator", size: "sq", tone: "ash" },
  { title: "Festive season post series", category: "Posts", tools: "Photoshop", size: "sq", tone: "lime" },
  { title: "Restaurant social media kit", category: "Posts", tools: "Photoshop", size: "wide", tone: "ink" },
  { title: "Product launch reel", category: "Videos", tools: "Premiere Pro", size: "wide", tone: "ink" },
  { title: "Animated logo reveal", category: "Animation", tools: "After Effects", size: "sq", tone: "ash" },
  { title: "Explainer animation", category: "Animation", tools: "After Effects", size: "sq", tone: "ember" },
];

function titleFromFile(file) {
  const t = file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const PROJECTS = CATEGORIES.slice(1).flatMap((category) => {
  const files = Object.entries(FOLDERS[category] || {}).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
  if (files.length === 0) {
    return SAMPLES.filter((p) => p.category === category).map((p) => ({ ...p, image: null, link: "#" }));
  }
  return files.map(([path, url]) => {
    const file = path.split("/").pop();
    const extra = WORK_DETAILS[file] || {};
    return {
      title: extra.title || titleFromFile(file),
      category,
      tools: extra.tools || CATEGORY_INFO[category].tools,
      image: url,
      link: extra.link || url,
      size: extra.size || CATEGORY_INFO[category].size,
      tone: "ink",
    };
  });
});

const MORE_WORK = [
  { name: "Wedding highlight film", kind: "Video edit", year: 2025, link: "#" },
  { name: "Tuition class promo", kind: "Animated ad", year: 2025, link: "#" },
  { name: "Hardware shop rebrand", kind: "Logo and print", year: 2024, link: "#" },
  { name: "YouTube channel package", kind: "Thumbnails and intro", year: 2023, link: "#" },
];

/* ------------------------------------------------------------------ */

/* ---------- Motion helpers ---------- */

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Elements with data-reveal fade up when scrolled into view. The observer marks them
// with data-shown (an attribute React doesn't manage, so re-renders keep it).
let revealObserver;
function observeReveals() {
  const els = document.querySelectorAll("[data-reveal]:not([data-shown])");
  if (reducedMotion() || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.setAttribute("data-shown", ""));
    return;
  }
  revealObserver ??= new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.setAttribute("data-shown", "");
        revealObserver.unobserve(en.target);
      }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  els.forEach((el) => revealObserver.observe(el));
}

// Pointer position inside an element: x/y as 0..1, nx/ny as -1..1.
function trackPointer(e, el) {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  return { x, y, nx: x * 2 - 1, ny: y * 2 - 1 };
}

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(to);
  useEffect(() => {
    if (reducedMotion() || !("IntersectionObserver" in window)) return;
    setValue(0);
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 1400);
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <strong ref={ref}>{value}{suffix}</strong>;
}

function ArrowIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PillButton({ href, children, variant = "light" }) {
  const onMove = (e) => {
    if (!finePointer() || reducedMotion()) return;
    const { nx, ny } = trackPointer(e, e.currentTarget);
    e.currentTarget.style.setProperty("--mx", `${nx * 6}px`);
    e.currentTarget.style.setProperty("--my", `${ny * 5}px`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty("--mx", "0px");
    e.currentTarget.style.setProperty("--my", "0px");
  };
  return (
    <a className={`pill pill-${variant}`} href={href} onMouseMove={onMove} onMouseLeave={onLeave}>
      <span>{children}</span>
      <span className="pill-dot"><ArrowIcon size={14} /></span>
    </a>
  );
}

function Nav() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={hidden ? "nav nav-hidden" : "nav"}>
      <a href="#top" className="nav-brand">
        <span>{PROFILE.short}<em>.</em></span>
      </a>
      <nav className="nav-links" aria-label="Main">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>
      <PillButton href="#contact">Get in touch</PillButton>
    </header>
  );
}

function Hero() {
  const onMove = (e) => {
    if (!finePointer() || reducedMotion()) return;
    const { nx, ny } = trackPointer(e, e.currentTarget);
    e.currentTarget.style.setProperty("--px", nx.toFixed(3));
    e.currentTarget.style.setProperty("--py", ny.toFixed(3));
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  };
  return (
    <section className="hero" id="top" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="hero-photo" aria-hidden="true">
        <img src={cutout} alt="" />
      </div>
      <div className="hero-inner">
        <div className="hero-main">
          <p className="hero-hi">Hey, I’m {PROFILE.name}</p>
          <h1 className="hero-title">
            <span>Edit.</span>
            <span>Animate.</span>
            <span>Design.</span>
          </h1>
        </div>
        <div className="hero-side">
          <p className="hero-lead">{PROFILE.years} years of making brands move.</p>
          <p className="hero-sub">Logos, social posts, videos and animation, made to be noticed and remembered.</p>
        </div>
      </div>
      <ul className="hero-services">
        {SERVICES.map((s, i) => (
          <li key={s} style={{ "--i": i }}><span>#0{i + 1}</span>{s}</li>
        ))}
      </ul>
    </section>
  );
}

function Strip() {
  return (
    <section className="strip" aria-label="What I make" data-reveal>
      <p className="strip-years"><CountUp to={PROFILE.years} suffix="+" /> years of client work</p>
      <ul className="strip-kinds">
        <li><span className="k-ring" />Logos</li>
        <li><span className="k-bar" />Posts</li>
        <li><span className="k-half" />Videos</li>
        <li><span className="k-duo" />Animation</li>
      </ul>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <div data-reveal>
        <p className="kicker">Behind the work</p>
        <h2>Ideas you can see, edits you can feel.</h2>
      </div>
      <div className="about-body" data-reveal style={{ "--i": 2 }}>
        <p className="about-lead">
          I’m a video editor, animator and graphic designer. For {PROFILE.years} years I’ve helped
          businesses and creators tell their story, from the first logo sketch to the final cut.
        </p>
        <div className="about-cta">
          <p>Have a project in mind? Let’s build it together.</p>
          <PillButton href="#contact" variant="orange">Get in touch</PillButton>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [...SERVICES, ...SERVICES];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <span className="marquee-group" key={copy}>
            {words.map((w, i) => (
              <span key={i} className={i % 2 ? "mq-word mq-outline" : "mq-word"}>{w}<em>✦</em></span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ p, i }) {
  const onMove = (e) => {
    if (!finePointer() || reducedMotion()) return;
    const el = e.currentTarget;
    const { x, y, nx, ny } = trackPointer(e, el);
    el.style.setProperty("--rx", `${(-ny * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(nx * 6).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <a
      href={p.link}
      className={`card card-${p.size} tone-${p.tone}`}
      target={p.link !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      data-reveal
      style={{ "--i": i }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {p.image ? (
        <img className="card-img" src={p.image} alt={p.title} />
      ) : (
        <div className="card-art" aria-hidden="true">
          <span>{p.category === "Videos" ? "▶" : p.category === "Animation" ? "✦" : p.category === "Logos" ? "◎" : "▦"}</span>
        </div>
      )}
      <span className="card-link"><LinkIcon /></span>
      <div className="card-meta">
        <h3>{p.title}</h3>
        <p>{p.category} <span>/</span> {p.tools}</p>
      </div>
    </a>
  );
}

function Work() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const headRef = useRef(null);
  const matching = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  // 8 fills the 4-column mixed grid (and the poster grid) exactly; the flat grid has 3 columns.
  const perPage = filter === "All" || filter === "Film Posters" ? 8 : 6;
  const pages = Math.max(1, Math.ceil(matching.length / perPage));
  const current = Math.min(page, pages);
  const shown = matching.slice((current - 1) * perPage, current * perPage);

  // New cards (filter or page change) are fresh elements, so hand them to the observer.
  useEffect(() => { observeReveals(); }, [filter, current]);

  const pickFilter = (c) => { setFilter(c); setPage(1); };
  const goTo = (n) => {
    setPage(n);
    headRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="work" id="work">
      <div className="work-head" ref={headRef} data-reveal>
        <h2>Selected work</h2>
        <div className="chips" role="tablist" aria-label="Filter projects">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              className={filter === c ? "chip is-on" : "chip"}
              onClick={() => pickFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div key={`${filter}-${current}`} className={filter === "All" ? "grid" : filter === "Film Posters" ? "grid grid-flat grid-posters" : "grid grid-flat"}>
        {shown.map((p, i) => (
          // In "All", everything except posters is square so every row fills 4 across with no gaps.
          <ProjectCard key={p.title} p={filter === "All" && p.size !== "poster" ? { ...p, size: "sq" } : p} i={i} />
        ))}
      </div>

      {pages > 1 && (
        <nav className="pager" aria-label="Project pages">
          <button className="chip pager-step" onClick={() => goTo(current - 1)} disabled={current === 1} aria-label="Previous page">
            <span className="pager-flip"><ArrowIcon size={14} /></span>
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={n === current ? "chip is-on" : "chip"}
              aria-current={n === current ? "page" : undefined}
              onClick={() => goTo(n)}
            >
              {n}
            </button>
          ))}
          <button className="chip pager-step" onClick={() => goTo(current + 1)} disabled={current === pages} aria-label="Next page">
            <ArrowIcon size={14} />
          </button>
        </nav>
      )}

      <h3 className="more-title" data-reveal>More work</h3>
      <ul className="more">
        {MORE_WORK.map((w, i) => (
          <li key={w.name} data-reveal style={{ "--i": i }}>
            <a href={w.link}>
              <span className="more-icon"><LinkIcon /></span>
              <span className="more-name">{w.name}</span>
              <span className="more-kind">{w.kind}</span>
              <span className="more-year">{w.year}</span>
              <span className="more-go"><ArrowIcon /></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <p className="contact-status" data-reveal><span className="live" />Available for new projects</p>
      <h2 data-reveal style={{ "--i": 1 }}>Let’s make something people stop scrolling for.</h2>
      <a className="contact-mail" data-reveal style={{ "--i": 2 }} href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
      <div className="contact-actions" data-reveal style={{ "--i": 3 }}>
        <PillButton href={`tel:${PROFILE.phone}`}>Call {PROFILE.phone}</PillButton>
        <PillButton href={`https://wa.me/${PROFILE.phoneIntl}`} variant="orange">Message on WhatsApp</PillButton>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => { observeReveals(); }, []);
  return (
    <div className="site">
      <Nav />
      <main>
        <Hero />
        <Strip />
        <About />
        <Marquee />
        <Work />
        <Contact />
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  );
}
