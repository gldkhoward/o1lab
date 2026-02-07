"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  DoorOpen,
  Cpu,
  Users,
  Paintbrush,
  Music,
  Cog,
  GraduationCap,
  Rocket,
  Compass,
  type LucideIcon,
} from "lucide-react";

/* ── Animated "For Who" grid config ──
 *
 * 6 cards in a 2-row × 3-column topology:
 *   [0: top-left]  [1: top-mid]  [2: top-right]
 *   [3: bot-left]  [4: bot-mid]  [5: bot-right]
 *
 * Each layout shifts the row boundary (splitY) and column
 * boundaries (a, b for top; c, d for bottom) so cards grow/
 * shrink in-place — no jumping across the grid.
 */
const GRID_COLS = 18;
const GRID_ROWS = 9;
const GAP_PX = 24;

interface CellPos { col: number; row: number; w: number; h: number }

function makeLayout(
  splitY: number,
  a: number, b: number,
  c: number, d: number,
): CellPos[] {
  return [
    { col: 0, row: 0, w: a, h: splitY },         // 0 top-left
    { col: a, row: 0, w: b - a, h: splitY },         // 1 top-mid
    { col: b, row: 0, w: 18 - b, h: splitY },         // 2 top-right
    { col: 0, row: splitY, w: c, h: 9 - splitY },     // 3 bot-left
    { col: c, row: splitY, w: d - c, h: 9 - splitY },     // 4 bot-mid
    { col: d, row: splitY, w: 18 - d, h: 9 - splitY },     // 5 bot-right
  ];
}

const forLayouts: CellPos[][] = [
  //                    splitY  a   b   c   d       what changed
  makeLayout(5, 6, 12, 6, 12),  // 0 — baseline even
  makeLayout(5, 9, 12, 6, 12),  // 1 — top-left grows
  makeLayout(5, 9, 15, 6, 12),  // 2 — top-mid grows
  makeLayout(6, 9, 15, 6, 12),  // 3 — top row deepens
  makeLayout(6, 9, 15, 9, 12),  // 4 — bot-left grows
  makeLayout(6, 9, 15, 9, 15),  // 5 — bot-mid grows
  makeLayout(5, 9, 15, 9, 15),  // 6 — bot row grows back
  makeLayout(5, 6, 15, 9, 15),  // 7 — top-left shrinks
  makeLayout(5, 6, 12, 9, 15),  // 8 — top-mid shrinks
  makeLayout(3, 6, 12, 9, 15),  // 9 — top row shrinks
  makeLayout(3, 6, 12, 6, 15),  // 10 — bot-left shrinks
  makeLayout(3, 6, 12, 6, 12),  // 11 — bot-mid shrinks → near baseline
];

interface ForCard {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const forCards: ForCard[] = [
  { Icon: Paintbrush, title: "Artists", desc: "You want to build an installation but don\u2019t know where to start with the electronics." },
  { Icon: Music, title: "Musicians", desc: "Build your own MIDI controller, synth module, or something that doesn\u2019t exist yet." },
  { Icon: Cog, title: "Tinkerers", desc: "You\u2019ve been watching YouTube tutorials. Time to actually solder something." },
  { Icon: GraduationCap, title: "Students", desc: "Your uni lab is booked and your dorm room doesn\u2019t have an oscilloscope." },
  { Icon: Rocket, title: "Founders", desc: "In the Arrayah accelerator and need somewhere to prototype hardware fast." },
  { Icon: Compass, title: "The Curious", desc: "You don\u2019t even know what you want to build yet. That\u2019s the best place to start." },
];

/* ── Interactive Space Visual ── */
const TILE_SIZE = 40;
const GLOW_RADIUS = 100;
const GLOW_FADE = 0.92;

/* Default tunable values */
const DEF_SPRING = 0.005;
const DEF_DAMPING = 0.95;
const DEF_REPEL_STRENGTH = 12;
const DEF_REPEL_RADIUS = 150;
const DEF_SPREAD = 0;       // 0 = point/circle push, 1 = flat wall push

function SpaceVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const oneRef = useRef<HTMLDivElement>(null);
  const zeroRef = useRef<HTMLDivElement>(null);

  // Tunable params — stored in refs so rAF reads latest without re-render deps
  const [spring, setSpring] = useState(DEF_SPRING);
  const [damping, setDamping] = useState(DEF_DAMPING);
  const [strength, setStrength] = useState(DEF_REPEL_STRENGTH);
  const [radius, setRadius] = useState(DEF_REPEL_RADIUS);
  const [spread, setSpread] = useState(DEF_SPREAD);

  const springRef = useRef(DEF_SPRING);
  const dampingRef = useRef(DEF_DAMPING);
  const strengthRef = useRef(DEF_REPEL_STRENGTH);
  const radiusRef = useRef(DEF_REPEL_RADIUS);
  const spreadRef = useRef(DEF_SPREAD);

  useEffect(() => { springRef.current = spring; }, [spring]);
  useEffect(() => { dampingRef.current = damping; }, [damping]);
  useEffect(() => { strengthRef.current = strength; }, [strength]);
  useEffect(() => { radiusRef.current = radius; }, [radius]);
  useEffect(() => { spreadRef.current = spread; }, [spread]);

  // Physics state
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: -9999, y: -9999, inside: false });
  const center = useRef({ x: 0, y: 0 });
  const size = useRef({ w: 0, h: 0 });
  const glowCells = useRef<Map<string, number>>(new Map());

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;
    mouse.current.inside = true;

    // Light up grid cells near cursor
    const cols = Math.ceil(rect.width / TILE_SIZE);
    const rows = Math.ceil(rect.height / TILE_SIZE);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * TILE_SIZE + TILE_SIZE / 2;
        const cy = r * TILE_SIZE + TILE_SIZE / 2;
        const dist = Math.hypot(cx - mouse.current.x, cy - mouse.current.y);
        if (dist < GLOW_RADIUS) {
          const intensity = 1 - dist / GLOW_RADIUS;
          const key = `${c},${r}`;
          const existing = glowCells.current.get(key) || 0;
          glowCells.current.set(key, Math.max(existing, intensity));
        }
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouse.current.inside = false;
    mouse.current.x = -9999;
    mouse.current.y = -9999;
  }, []);

  /* ── Touch support for mobile ── */
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;
    mouse.current.x = touch.clientX - rect.left;
    mouse.current.y = touch.clientY - rect.top;
    mouse.current.inside = true;

    const cols = Math.ceil(rect.width / TILE_SIZE);
    const rows = Math.ceil(rect.height / TILE_SIZE);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * TILE_SIZE + TILE_SIZE / 2;
        const cy = r * TILE_SIZE + TILE_SIZE / 2;
        const dist = Math.hypot(cx - mouse.current.x, cy - mouse.current.y);
        if (dist < GLOW_RADIUS) {
          const intensity = 1 - dist / GLOW_RADIUS;
          const key = `${c},${r}`;
          const existing = glowCells.current.get(key) || 0;
          glowCells.current.set(key, Math.max(existing, intensity));
        }
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouse.current.inside = false;
    mouse.current.x = -9999;
    mouse.current.y = -9999;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const one = oneRef.current;
    const zero = zeroRef.current;
    if (!container || !canvas || !one || !zero) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      size.current.w = rect.width;
      size.current.h = rect.height;
      center.current.x = rect.width / 2;
      center.current.y = rect.height / 2;
      canvas.width = rect.width;
      canvas.height = rect.height;
      pos.current.x = 0;
      pos.current.y = 0;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    let animId: number;

    function applyRepulsion(
      srcX: number, srcY: number,
      absX: number, absY: number,
      repelRadius: number, repelStrength: number,
    ) {
      const dx = absX - srcX;
      const dy = absY - srcY;
      const dist = Math.hypot(dx, dy);
      if (dist < repelRadius && dist > 0.1) {
        const force = (1 - dist / repelRadius) * repelStrength;
        const nx = dx / dist;
        const ny = dy / dist;
        vel.current.x += nx * force;
        vel.current.y += ny * force;
      }
    }

    function tick() {
      const { x: mx, y: my, inside } = mouse.current;
      const cx = center.current.x;
      const cy = center.current.y;
      const w = size.current.w;
      const h = size.current.h;
      const repelRadius = radiusRef.current;
      const repelStrength = strengthRef.current;
      const sp = spreadRef.current;  // 0–1

      const absX = cx + pos.current.x;
      const absY = cy + pos.current.y;

      if (inside) {
        // Direction from cursor to "1"
        const toDx = absX - mx;
        const toDy = absY - my;
        const toDist = Math.hypot(toDx, toDy);

        if (sp < 0.01) {
          // Point push — single source
          applyRepulsion(mx, my, absX, absY, repelRadius, repelStrength);
        } else {
          // Spread push — fan of virtual sources perpendicular to approach
          // Perpendicular direction
          let perpX = 0, perpY = 0;
          if (toDist > 0.1) {
            perpX = -toDy / toDist;
            perpY = toDx / toDist;
          } else {
            perpX = 1;
            perpY = 0;
          }

          const maxSpreadPx = sp * 400; // max spread width in px at spread=1
          const numPoints = Math.floor(3 + sp * 12); // 3–15 virtual sources
          const perPointStrength = repelStrength / Math.sqrt(numPoints);

          for (let i = 0; i < numPoints; i++) {
            const t = numPoints === 1 ? 0 : (i / (numPoints - 1)) * 2 - 1; // -1..1
            const srcX = mx + perpX * t * maxSpreadPx * 0.5;
            const srcY = my + perpY * t * maxSpreadPx * 0.5;
            applyRepulsion(srcX, srcY, absX, absY, repelRadius, perPointStrength);
          }
        }

        // Edge escape
        const margin = 60;
        const nearEdge =
          absX < margin || absX > w - margin ||
          absY < margin || absY > h - margin;
        const distToCursor = toDist;

        if (nearEdge && distToCursor < repelRadius * 0.5) {
          const escapeSpeed = 8;
          let escX = 0, escY = 0;
          if (absX < margin) escX = escapeSpeed;
          if (absX > w - margin) escX = -escapeSpeed;
          if (absY < margin) escY = escapeSpeed;
          if (absY > h - margin) escY = -escapeSpeed;
          if (escX === 0) escX = toDx > 0 ? escapeSpeed * 0.5 : -escapeSpeed * 0.5;
          if (escY === 0) escY = toDy > 0 ? escapeSpeed * 0.5 : -escapeSpeed * 0.5;
          // Reduce escape when spread is high — harder to dodge a wall
          const escapeFactor = 1 - sp * 0.8;
          vel.current.x += escX * escapeFactor;
          vel.current.y += escY * escapeFactor;
        }
      }

      // Spring + damping
      vel.current.x += -pos.current.x * springRef.current;
      vel.current.y += -pos.current.y * springRef.current;
      vel.current.x *= dampingRef.current;
      vel.current.y *= dampingRef.current;

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      // Clamp
      const pad = 50;
      const maxX = w / 2 - pad;
      const maxY = h / 2 - pad;
      if (pos.current.x > maxX) { pos.current.x = maxX; vel.current.x *= -0.3; }
      if (pos.current.x < -maxX) { pos.current.x = -maxX; vel.current.x *= -0.3; }
      if (pos.current.y > maxY) { pos.current.y = maxY; vel.current.y *= -0.3; }
      if (pos.current.y < -maxY) { pos.current.y = -maxY; vel.current.y *= -0.3; }

      // Apply transforms
      const tx = `translate(calc(-50% + ${pos.current.x}px), calc(-50% + ${pos.current.y}px))`;
      one!.style.transform = tx;

      const elapsed = performance.now() / 1000;
      const deg = (elapsed * 18) % 360;
      zero!.style.transform = `translate(calc(-50% + ${pos.current.x}px), calc(-50% + ${pos.current.y}px)) rotate(${deg}deg)`;

      // Grid glow
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, w, h);
        const toDelete: string[] = [];
        glowCells.current.forEach((intensity, key) => {
          const [cs, rs] = key.split(",");
          const c = parseInt(cs);
          const r = parseInt(rs);
          ctx.fillStyle = `rgba(217, 184, 52, ${intensity * 0.35})`;
          ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);
          const next = intensity * GLOW_FADE;
          if (next < 0.01) {
            toDelete.push(key);
          } else {
            glowCells.current.set(key, next);
          }
        });
        toDelete.forEach((k) => glowCells.current.delete(k));
      }

      animId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div className="space-visual-wrap">
      <div
        className="space-visual"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid-lines"></div>
        <canvas ref={canvasRef} className="glow-canvas" />
        <div className="big-zero" ref={zeroRef}></div>
        <div className="big-one" ref={oneRef}>1</div>
        <span className="label l1">A place to experiment</span>
        <span className="label l2">Sydney, AU</span>
      </div>
      <div className="space-sliders">
        <input type="range" min={0.001} max={0.04} step={0.001} value={spring}
          onChange={(e) => setSpring(parseFloat(e.target.value))} />
        <input type="range" min={0.8} max={0.99} step={0.005} value={damping}
          onChange={(e) => setDamping(parseFloat(e.target.value))} />
        <input type="range" min={1} max={30} step={0.5} value={strength}
          onChange={(e) => setStrength(parseFloat(e.target.value))} />
        <input type="range" min={50} max={350} step={5} value={radius}
          onChange={(e) => setRadius(parseFloat(e.target.value))} />
        <input type="range" min={0} max={1} step={0.02} value={spread}
          onChange={(e) => setSpread(parseFloat(e.target.value))} />
      </div>
    </div>
  );
}

export default function Home() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);


  // Cycle through grid layouts
  useEffect(() => {
    const id = setInterval(() => {
      setLayoutIdx((prev) => (prev + 1) % forLayouts.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Cursor follower
    const dot = cursorDotRef.current;
    if (!dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    function animateDot() {
      dotX += (mouseX - dotX) * 0.12;
      dotY += (mouseY - dotY) * 0.12;
      if (dot) {
        dot.style.left = (dotX - 8) + "px";
        dot.style.top = (dotY - 8) + "px";
      }
      animationId = requestAnimationFrame(animateDot);
    }

    document.addEventListener("mousemove", handleMouseMove);
    animateDot();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={cursorDotRef}></div>

      {/* NAV */}
      <nav>
        <div className="logo">
          o1 <span>lab</span>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#manifesto">About</a>
          </li>
          <li>
            <a href="#space">The Space</a>
          </li>
          <li>
            <a href="#who">Who</a>
          </li>
          <li>
            <a href="#join">Join</a>
          </li>
        </ul>
        <button
          className={`mobile-menu-btn${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="#manifesto" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#space" onClick={() => setMenuOpen(false)}>The Space</a>
        <a href="#who" onClick={() => setMenuOpen(false)}>Who</a>
        <a href="#join" onClick={() => setMenuOpen(false)}>Join</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="o">o</span>1<br />
            lab
          </h1>
          <p className="hero-subtitle">
            Open access hardware lab
            <br />
            From zero → one
            <br />
            Sydney, AU
          </p>
        </div>
        <div className="hero-right">
          <div className="geo-circle"></div>
          <div className="geo-circle"></div>
          <div className="geo-circle"></div>
          <span className="float-text ft1">Ideas start here</span>
          <span className="float-text ft2">Hardware for all</span>
          <span className="float-text ft3">Est. 2025</span>
        </div>
        <div className="arrow-down">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <span>Robotics</span>
          <span className="dot">●</span>
          <span>Art Installations</span>
          <span className="dot">●</span>
          <span>Music Hardware</span>
          <span className="dot">●</span>
          <span>Kinetic Sculpture</span>
          <span className="dot">●</span>
          <span>Electronics</span>
          <span className="dot">●</span>
          <span>Weird Machines</span>
          <span className="dot">●</span>
          <span>Interactive Design</span>
          <span className="dot">●</span>
          <span>Soldering</span>
          <span className="dot">●</span>
          <span>3D Printing</span>
          <span className="dot">●</span>
          <span>Prototyping</span>
          <span className="dot">●</span>
          <span>Whatever You Want</span>
          <span className="dot">●</span>
          {/* duplicate for seamless loop */}
          <span>Robotics</span>
          <span className="dot">●</span>
          <span>Art Installations</span>
          <span className="dot">●</span>
          <span>Music Hardware</span>
          <span className="dot">●</span>
          <span>Kinetic Sculpture</span>
          <span className="dot">●</span>
          <span>Electronics</span>
          <span className="dot">●</span>
          <span>Weird Machines</span>
          <span className="dot">●</span>
          <span>Interactive Design</span>
          <span className="dot">●</span>
          <span>Soldering</span>
          <span className="dot">●</span>
          <span>3D Printing</span>
          <span className="dot">●</span>
          <span>Prototyping</span>
          <span className="dot">●</span>
          <span>Whatever You Want</span>
          <span className="dot">●</span>
        </div>
      </div>

      {/* MANIFESTO */}
      <section className="manifesto reveal" id="manifesto">
        <p>
          We believe the biggest barrier to making{" "}
          <em>physical things</em> isn&apos;t talent, it&apos;s access. Access
          to tools, space, components, and someone who&apos;s been there before.
        </p>
        <p style={{ marginTop: "32px" }}>
          o1 lab is a garage. Literally. A place where <em>anyone</em> with an
          idea can walk in and start building. No gatekeeping, no prerequisites,
          no pitch decks.
        </p>
        <span className="aside">
          Not a startup. Not an incubator. Just a really good garage.
        </span>
      </section>

      {/* WHAT CARDS */}
      <section className="what-section" id="what">
        <div className="what-card reveal">
          <span className="num">01</span>
          <span className="icon">
            <DoorOpen size={32} strokeWidth={1.5} />
          </span>
          <h3>Open Access</h3>
          <p>
            Walk in. Use the tools. Ask questions. Leave inspired. The lab is
            open to anyone working on hardware. Hobbyist, artist, student,
            whoever.
          </p>
        </div>
        <div
          className="what-card reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          <span className="num">02</span>
          <span className="icon">
            <Cpu size={32} strokeWidth={1.5} />
          </span>
          <h3>Engineering Support</h3>
          <p>
            Stuck on a circuit? Need help with a microcontroller? Someone&apos;s
            always around to help you debug, design, or just think it through.
          </p>
        </div>
        <div
          className="what-card reveal"
          style={{ transitionDelay: "0.2s" }}
        >
          <span className="num">03</span>
          <span className="icon">
            <Users size={32} strokeWidth={1.5} />
          </span>
          <h3>Community</h3>
          <p>
            Cross-pollination between artists, engineers, musicians, and
            tinkerers. The best ideas happen when different worlds collide in a
            garage.
          </p>
        </div>
      </section>

      {/* ZERO TO ONE */}
      <section className="journey reveal" id="journey">
        <div className="journey-inner">
          <h2 className="journey-header">
            <span className="zero"></span>
            <span className="arrow"></span>
            <span className="one">1</span>
          </h2>
          <p className="journey-sub">
            We exist for that first step. The hardest one. Going from nothing to
            something real you can hold.
          </p>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="for-section" id="who">
        <div className="for-heading">
          <h2>This is for you if...</h2>
          <p className="sub">No experience necessary. Seriously.</p>
        </div>
        <div className="for-grid-animated reveal">
          {forCards.map((card, i) => {
            const pos = forLayouts[layoutIdx][i];
            const area = pos.w * pos.h;
            const compact = area <= 12;
            const IconComp = card.Icon;
            return (
              <div
                key={card.title}
                className={`for-card${compact ? " compact" : ""}`}
                style={{
                  left: `calc(${(pos.col / GRID_COLS) * 100}% + ${GAP_PX}px)`,
                  top: `calc(${(pos.row / GRID_ROWS) * 100}% + ${GAP_PX}px)`,
                  width: `calc(${(pos.w / GRID_COLS) * 100}% - ${GAP_PX * 2}px)`,
                  height: `calc(${(pos.h / GRID_ROWS) * 100}% - ${GAP_PX * 2}px)`,
                }}
              >
                <span className="for-card-icon">
                  <IconComp size={24} strokeWidth={1.5} />
                </span>
                <h4>{card.title}</h4>
                <p className="for-card-desc">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE SPACE */}
      <section className="space-section" id="space">
        <SpaceVisual />
        <div className="space-text reveal">
          <h2>A garage with the right stuff in it</h2>
          <p>
            We&apos;re sourcing components and equipment so you don&apos;t have
            to wait 3 weeks for a shipment from Shenzhen. Walk in, grab what you
            need, start building.
          </p>
          <p>
            The space runs indefinitely. It&apos;s not a pop-up. It&apos;s not a
            6-week program. It&apos;s just here, whenever you need it.
          </p>
          <div className="detail-list">
            <span className="tag">Soldering Stations</span>
            <span className="tag">3D Printers</span>
            <span className="tag">Oscilloscopes</span>
            <span className="tag">Component Library</span>
            <span className="tag">Microcontrollers</span>
            <span className="tag">Power Supplies</span>
            <span className="tag">Hand Tools</span>
            <span className="tag">Good Vibes</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="join">
        <div className="cta-shapes">
          <div className="shape s1"></div>
          <div className="shape s2"></div>
          <div className="shape s3"></div>
        </div>
        <h2 className="reveal">
          Got an idea?
          <br />
          <span className="highlight">Come build it.</span>
        </h2>
        <p
          className="subtext reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          No application. No interview. No portfolio review. Just show up, or
          drop us a line if you want to know more.
        </p>
        <a
          href="mailto:hello@o1lab.space"
          className="cta-btn reveal"
          style={{ transitionDelay: "0.2s" }}
        >
          Get in touch
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="foot-logo">
            o1 <span>lab</span>
          </div>
          <p className="foot-tagline">
            Open access hardware lab. From zero to one.
          </p>
        </div>
        <div className="foot-col">
          <h5>Links</h5>
          <a href="#manifesto">About</a>
          <a href="#space">The Space</a>
          <a href="#who">Who It&apos;s For</a>
          <a href="#join">Get Involved</a>
        </div>
        <div className="foot-col">
          <h5>Connect</h5>
          <a href="#">Instagram</a>
          <a href="#">Twitter / X</a>
          <a href="#">Discord</a>
          <a href="mailto:hello@o1lab.space">Email</a>
        </div>
        <div className="foot-bottom">
          <p>© 2025 o1 lab</p>
          <p>Made in a garage in Sydney</p>
        </div>
      </footer>
    </>
  );
}
