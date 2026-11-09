import { useState, useRef, useEffect } from "react";
import "./App.css";
import cutout from "./hero-cutout.webp";
import photoshopLogo from "./tools/photoshop.svg";
import illustratorLogo from "./tools/illustrator.svg";
import figmaLogo from "./tools/figma.svg";
import fontforgeLogo from "./tools/fontforge.svg";
import premiereLogo from "./tools/premiere-pro.svg";
import afterEffectsLogo from "./tools/after-effects.svg";
import davinciLogo from "./tools/davinci-resolve.svg";
import blenderLogo from "./tools/blender.svg";
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

/* Skills & Tools. Logos live in src/tools. `use` is the short line under each
   tool's name; edit freely. */
const TOOLS = [
  { name: "Adobe Photoshop", logo: photoshopLogo, group: "Design", color: "#31a8ff", use: "Posters, social posts, photo retouching" },
  { name: "Adobe Illustrator", logo: illustratorLogo, group: "Design", color: "#ff9a00", use: "Logos, brand identity, vector art" },
  { name: "Figma", logo: figmaLogo, group: "Design", color: "#a259ff", use: "Layouts, UI and social templates" },
  { name: "FontForge", logo: fontforgeLogo, group: "Design", color: "#e2e2de", use: "Custom type and lettering" },
  { name: "Adobe Premiere Pro", logo: premiereLogo, group: "Video & Motion", color: "#ea77ff", use: "Video editing, reels, promos" },
  { name: "Adobe After Effects", logo: afterEffectsLogo, group: "Video & Motion", color: "#9999ff", use: "Motion graphics, logo animation" },
  { name: "DaVinci Resolve", logo: davinciLogo, group: "Video & Motion", color: "#ff5c5c", use: "Colour grading and editing" },
  { name: "Blender", logo: blenderLogo, group: "3D", color: "#f5792a", use: "3D models, scenes and renders" },
];

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

/* Client reviews. Replace these placeholders with real feedback from your clients.
   rating: 1 to 5. photo: optional, e.g. import a file from src and put it here;
   without a photo the card shows the client's initials. */
const TESTIMONIALS = [
  {
    name: "Client name",
    role: "Business name / role",
    project: "Logo design",
    rating: 5,
    quote: "Paste what this client said about your work here. One to three sentences reads best.",
    photo: null,
  },
  {
    name: "Client name",
    role: "Business name / role",
    project: "Video editing",
    rating: 5,
    quote: "Paste what this client said about your work here. One to three sentences reads best.",
    photo: null,
  },
  {
    name: "Client name",
    role: "Business name / role",
    project: "Film poster",
    rating: 5,
    quote: "Paste what this client said about your work here. One to three sentences reads best.",
    photo: null,
  },
];

/* Pricing. Update your prices here.
   price: a number like 15000 shows "Starting from LKR 15,000 / per logo".
          null shows "Price on request".
   includes: optional list of what the price covers, e.g. ["3 logo concepts", "2 revisions"].
   CURRENCY applies to every card. */
const CURRENCY = "LKR";
const PRICING = [
  { service: "Logo design", about: "A logo that fits your brand, ready for print and social media.", price: null, unit: "per logo", includes: [] },
  { service: "Social media posts", about: "Eye-catching post designs for Facebook, Instagram and more.", price: null, unit: "per post", includes: [] },
  { service: "Video editing", about: "Reels, promos and highlight videos, cut and finished.", price: null, unit: "per video", includes: [] },
  { service: "Animation", about: "Logo reveals, motion graphics and animated ads.", price: null, unit: "per animation", includes: [] },
  { service: "Film posters", about: "Cinematic poster artwork for films, events and campaigns.", price: null, unit: "per poster", includes: [] },
  { service: "3D design", about: "3D models, scenes and renders made in Blender.", price: null, unit: "per project", includes: [] },
];

/* Achievements & Awards. Replace these placeholders with your real ones.
   type: "Award", "Certificate" or "Milestone" (picks the icon). Newest first reads best. */
const ACHIEVEMENTS = [
  { year: "2025", type: "Award", title: "Award or achievement title", by: "Organisation or event", note: "One line about what it was for." },
  { year: "2024", type: "Certificate", title: "Certificate or course name", by: "Issued by", note: "One line about what you learned or proved." },
  { year: "2023", type: "Milestone", title: "A milestone you are proud of", by: "Client, project or platform", note: "One line about why it mattered." },
];

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

const NAV_LINKS = [
  ["#about", "About"],
  ["#skills", "Skills"],
  ["#work", "Work"],
  ["#reviews", "Reviews"],
  ["#awards", "Awards"],
  ["#pricing", "Pricing"],
  ["#contact", "Contact"],
];

function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(!openRef.current && y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Phone menu: lock page scroll while open, close on Escape.
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={hidden ? "nav nav-hidden" : "nav"}>
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          <span>{PROFILE.short}<em>.</em></span>
        </a>
        <nav className="nav-links" aria-label="Main">
          {NAV_LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <PillButton href="#contact">Get in touch</PillButton>
          <button
            className={open ? "menu-btn is-open" : "menu-btn"}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </header>
      <div id="mobile-menu" className={open ? "menu is-open" : "menu"} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map(([href, label], i) => (
            <a key={href} href={href} style={{ "--i": i }} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
              <span>0{i + 1}</span>{label}
            </a>
          ))}
        </nav>
        <a className="menu-mail" href={`mailto:${PROFILE.email}`} tabIndex={open ? 0 : -1}>{PROFILE.email}</a>
      </div>
    </>
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

function Skills() {
  const groups = [...new Set(TOOLS.map((t) => t.group))];
  return (
    <section className="skills" id="skills">
      <div className="skills-head" data-reveal>
        <div>
          <p className="kicker">Skills &amp; Tools</p>
          <h2>The tools behind the work</h2>
        </div>
        <ul className="skills-groups" aria-label="Skill areas">
          {groups.map((g, i) => (
            <li key={g} style={{ "--i": i }}>{g}<span>{TOOLS.filter((t) => t.group === g).length}</span></li>
          ))}
        </ul>
      </div>
      <ul className="tools">
        {TOOLS.map((t, i) => (
          // --d staggers the entrance as a diagonal wave across the 4-column grid
          <li key={t.name} className="tool" data-reveal style={{ "--i": i, "--d": (i % 4) + Math.floor(i / 4) }}>
            <img className="tool-mark" src={t.logo} alt="" aria-hidden="true" />
            <div className="tool-top">
              <span className="tool-badge"><img src={t.logo} alt="" /></span>
              <span className="tool-tag">{t.group}</span>
            </div>
            <p className="tool-use">{t.use}</p>
            <div className="tool-foot">
              <h3>{t.name}</h3>
            </div>
          </li>
        ))}
      </ul>
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
              <span key={i} className={i % 2 ? "mq-word mq-outline" : "mq-word"}>{w}<i className="mq-dot" /></span>
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

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Work() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const headRef = useRef(null);
  // "All" mixes every category in a random order, shuffled once per visit so pages stay stable.
  const [mixed] = useState(() => shuffle(PROJECTS));
  const matching = filter === "All" ? mixed : PROJECTS.filter((p) => p.category === filter);
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

      <div key={`${filter}-${current}`} className={filter === "All" || filter === "Film Posters" ? "grid grid-flat grid-posters" : "grid grid-flat"}>
        {shown.map((p, i) => (
          // "All" uses equal portrait cards, so any random order fills rows of 4 with no gaps.
          <ProjectCard key={p.title} p={p} i={i} />
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

function Stars({ n }) {
  return (
    <span className="stars" role="img" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((k) => (
        <svg key={k} width="16" height="16" viewBox="0 0 24 24" className={k <= n ? "on" : ""} aria-hidden="true">
          <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  const avg = TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length;
  return (
    <section className="reviews" id="reviews">
      <div className="reviews-head" data-reveal>
        <div>
          <p className="kicker">Client feedback</p>
          <h2>What clients say</h2>
        </div>
        <div className="reviews-score">
          <strong>{avg.toFixed(1)}</strong>
          <div>
            <Stars n={Math.round(avg)} />
            <span>from {TESTIMONIALS.length} {TESTIMONIALS.length === 1 ? "review" : "reviews"}</span>
          </div>
        </div>
      </div>

      <ul className="reviews-grid">
        {TESTIMONIALS.map((t, i) => (
          <li key={i} className="review" data-reveal style={{ "--i": i }}>
            <span className="review-mark" aria-hidden="true">“</span>
            <Stars n={t.rating} />
            <blockquote>{t.quote}</blockquote>
            <div className="review-who">
              {t.photo ? (
                <img className="review-avatar" src={t.photo} alt="" />
              ) : (
                <span className="review-avatar" aria-hidden="true">{initials(t.name)}</span>
              )}
              <div className="review-name">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
              {t.project && <span className="review-tag">{t.project}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AwardIcon({ type }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (type === "Certificate") {
    return (
      <svg {...common}>
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.6 13.4 7.5 21l4.5-2.4 4.5 2.4-1.1-7.6" />
      </svg>
    );
  }
  if (type === "Milestone") {
    return (
      <svg {...common}>
        <path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.6l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M16 6h3v1.5A3.5 3.5 0 0 1 15.6 11M8 6H5v1.5A3.5 3.5 0 0 0 8.4 11M12 13v4M8.5 20h7M10 17h4" />
    </svg>
  );
}

function Achievements() {
  if (ACHIEVEMENTS.length === 0) return null;
  const types = [...new Set(ACHIEVEMENTS.map((a) => a.type))];
  return (
    <section className="awards" id="awards">
      <div className="awards-head" data-reveal>
        <div>
          <p className="kicker">Achievements &amp; Awards</p>
          <h2>Recognition along the way</h2>
        </div>
        <ul className="skills-groups" aria-label="Achievement types">
          {types.map((t, i) => (
            <li key={t} style={{ "--i": i }}>{t}<span>{ACHIEVEMENTS.filter((a) => a.type === t).length}</span></li>
          ))}
        </ul>
      </div>
      <ol className="awards-list">
        {ACHIEVEMENTS.map((a, i) => (
          <li key={i} className="award" data-reveal style={{ "--i": i }}>
            <span className="aw-year">{a.year}</span>
            <span className="aw-icon"><AwardIcon type={a.type} /></span>
            <div className="aw-text">
              <h3>{a.title}</h3>
              <p><span>{a.by}</span>{a.note && <><span className="aw-sep"> · </span><span>{a.note}</span></>}</p>
            </div>
            <span className="aw-type">{a.type}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Pricing() {
  if (PRICING.length === 0) return null;
  const quote = (service) =>
    `https://wa.me/${PROFILE.phoneIntl}?text=${encodeURIComponent(`Hi ${PROFILE.short}, I'd like a quote for ${service.toLowerCase()}.`)}`;
  return (
    <section className="pricing" id="pricing">
      <div className="pricing-head" data-reveal>
        <div>
          <p className="kicker">Pricing</p>
          <h2>Simple, honest pricing</h2>
        </div>
        <p className="pricing-note">Every project is different. Send me the details and I’ll give you an exact quote.</p>
      </div>

      <ul className="plans">
        {PRICING.map((p, i) => (
          <li key={p.service} className="plan" data-reveal style={{ "--i": i }}>
            <div className="plan-top">
              <span className="plan-no">0{i + 1}</span>
              <h3>{p.service}</h3>
            </div>
            <p className="plan-about">{p.about}</p>
            <div className="plan-price">
              {p.price != null ? (
                <>
                  <span className="plan-from">Starting from</span>
                  <strong>{CURRENCY} {Number(p.price).toLocaleString("en-US")}</strong>
                  {p.unit && <span className="plan-unit">{p.unit}</span>}
                </>
              ) : (
                <>
                  <span className="plan-from">Pricing</span>
                  <strong className="plan-ask">Price on request</strong>
                </>
              )}
            </div>
            {p.includes?.length > 0 && (
              <ul className="plan-includes">
                {p.includes.map((x) => (
                  <li key={x}><span aria-hidden="true">✓</span>{x}</li>
                ))}
              </ul>
            )}
            <a className="plan-cta" href={quote(p.service)} target="_blank" rel="noreferrer">
              Get a quote <ArrowIcon size={14} />
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

/* ---------- Opening intro ----------
   Plays once per browser session (main.jsx adds html.intro-on when it should).
   Phases: "in" (name + counter) -> "out" (curtain lifts) -> "done" (removed). */
function Intro() {
  const [phase, setPhase] = useState(() =>
    document.documentElement.classList.contains("intro-on") ? "in" : "done"
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (phase !== "in") return;
    const DURATION = 1700;
    let raf;
    const start = performance.now();
    // The counter is cosmetic; a plain timer ends the intro so it can never get
    // stuck if animation frames are paused (background tab, slow device).
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      setCount(Math.round(100 * (1 - Math.pow(1 - t, 2.2))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const wait = setTimeout(() => { setCount(100); setPhase("out"); }, DURATION + 260);
    return () => { cancelAnimationFrame(raf); clearTimeout(wait); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "out") return;
    try { sessionStorage.setItem("introSeen", "1"); } catch { /* storage blocked: intro just plays again */ }
    // Let the curtain start lifting, then release the paused hero entrance.
    const release = setTimeout(() => document.documentElement.classList.remove("intro-on"), 320);
    const finish = setTimeout(() => setPhase("done"), 1250);
    return () => { clearTimeout(release); clearTimeout(finish); };
  }, [phase]);

  if (phase === "done") return null;
  return (
    <div className={`intro intro-${phase}`} aria-hidden="true">
      <div className="intro-orange" />
      <div className="intro-black">
        <div className="intro-center">
          <p className="intro-name">
            {[...PROFILE.short].map((c, i) => (
              <span className="intro-mask" key={i}><span style={{ "--i": i }}>{c}</span></span>
            ))}
            <span className="intro-dot" />
          </p>
          <p className="intro-tag">Edit · Animate · Design</p>
        </div>
        <div className="intro-foot">
          <span className="intro-label">Loading portfolio</span>
          <span className="intro-count">{String(count).padStart(3, "0")}</span>
        </div>
        <div className="intro-bar"><span style={{ transform: `scaleX(${count / 100})` }} /></div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => { observeReveals(); }, []);
  return (
    <div className="site">
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Strip />
        <About />
        <Skills />
        <Marquee />
        <Work />
        <Testimonials />
        <Achievements />
        <Pricing />
        <Contact />
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  );
}
