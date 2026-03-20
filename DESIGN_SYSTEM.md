# o1 lab — Design System & Visual Identity

> A complete reference for recreating the visual language of o1lab.space.
> Use this document as the source of truth when building landing pages or any new pages within the o1 lab brand.

---

## The Vibe

**Bold minimalism with playful energy.**

The site feels like a well-designed garage whiteboard — clean, confident, and inviting. It balances technical credibility (monospace labels, grid overlays, physics simulations) with warmth and approachability (cream backgrounds, golden yellow accents, friendly copy, breathing animations). Nothing feels corporate. Everything feels intentional but not precious.

**Key tensions the design holds:**
- Technical yet warm
- Minimal yet energetic
- Confident yet approachable
- Analog-feeling yet digitally crafted

**What it is NOT:**
- Glossy / SaaS-startup
- Dark-mode-first / hacker aesthetic
- Illustrative / character-driven
- Gradient-heavy / glassmorphism
- Overly polished or corporate

---

## Color Palette

```
Primary Accent (Yellow)
  --yellow:       #D9B834    — Primary accent. Warm, muted golden yellow. Used for highlights, hover states, icons, accents.
  --yellow-light: #EDD87A    — Lighter yellow. Large decorative numbers, subtle fills.
  --yellow-pale:  #F5ECBF    — Very pale yellow. Inline text highlight backgrounds (the "highlighter pen" effect).
  --yellow-glow:  #F0D04A    — Brighter yellow. Glow effects, box-shadows, canvas rendering.

Neutrals
  --cream:        #FAF7EE    — Off-white / warm cream. Primary background color. Feels paper-like.
  --dark:         #1B1B1B    — Near-black. Primary text, dark section backgrounds, footer.
  --mid:          #4A4A42    — Medium dark grey. Secondary body text, descriptions.
  --grey:         #9E9E8E    — Muted grey. Labels, timestamps, subtle metadata.
```

**Usage rules:**
- Background alternates between `--cream` (light sections) and `--dark` (dark sections like marquee, footer, interactive canvas)
- `--yellow` is the **only** chromatic color. No blues, greens, reds, or other hues anywhere
- Text selection uses `--yellow` background with `--dark` text
- Dark-on-cream for primary content. Cream-on-dark for inverted sections
- Yellow is used sparingly as an accent — it should feel like a spark, not a flood

---

## Typography

### Font Stack

| Role | Font | Source | Weights Used |
|------|------|--------|--------------|
| **Display / Body** | DM Sans | Google Fonts | 300 (light), 400 (regular), 500 (medium), 700 (bold) |
| **Monospace / Labels** | Space Mono | Google Fonts | 400 (regular), 700 (bold) |

### Type Scale & Hierarchy

| Element | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---------|------|------|--------|-------------|----------------|-------|
| **Hero title** | DM Sans | `clamp(64px, 9vw, 140px)` | 700 | 0.9 | -4px | Massive, tight leading. The "o" is yellow and wobbles. |
| **Section headings (h2)** | DM Sans | `clamp(28px, 5vw, 80px)` | 700 | 1.05–1.15 | -1px to -3px | Bold, tight tracking. Varies by section. |
| **Card headings (h3)** | DM Sans | 20px | 700 | default | -0.3px | |
| **Card subheadings (h4)** | DM Sans | 16px | 700 | default | 0 | Used in dark cards (for-section) |
| **Manifesto body** | DM Sans | `clamp(24px, 3.2vw, 42px)` | 300 | 1.4 | -0.5px | Large, lightweight, statement typography |
| **Body text** | DM Sans | 15–17px | 300 | 1.7–1.8 | 0 | Light weight feels elegant, not thin |
| **CTA subtext** | DM Sans | 17px | 300 | 1.7 | 0 | |
| **Hero subtitle** | Space Mono | 12px | 400 | 2 | 3px | Uppercase |
| **Nav links** | Space Mono | 11px | 400 | default | 1.5px | Uppercase |
| **Section labels / tags** | Space Mono | 10–11px | 400 | default | 2–3px | Uppercase. Used for metadata, categories, column headers |
| **Marquee text** | Space Mono | 13px | 400 | default | 3px | Uppercase. Yellow on dark |
| **Tags / pills** | Space Mono | 10px | 400 | default | 1.5px | Uppercase. Pill-shaped borders |
| **CTA button** | Space Mono | 13px | 400 | default | 2px | Uppercase |
| **Decorative numbers** | Space Mono | 64px | 700 | default | 0 | Yellow-light, positioned top-right of cards |
| **Footer copyright** | Space Mono | 10px | 400 | default | 2px | Uppercase, low opacity |
| **Logo** | DM Sans | 22px (nav), 28px (footer) | 700 | default | -0.5px | "o1" bold, "lab" in weight 300 at 0.6 opacity |

### Typography Principles

1. **DM Sans is the voice** — used for anything that "speaks" (headings, body copy, manifesto)
2. **Space Mono is the structure** — used for anything that "labels" (nav, tags, metadata, buttons, section markers)
3. **Space Mono is always uppercase** with generous letter-spacing (1.5–3px)
4. **Headlines are extremely tight** — negative letter-spacing (-1px to -4px) and compressed line-height (0.9–1.15)
5. **Body text is extremely light** — weight 300 with generous line-height (1.6–1.8)
6. **Size contrast is dramatic** — hero title can be 140px, while labels are 10px

---

## Layout & Spacing

### Spacing Scale

| Context | Desktop | Mobile |
|---------|---------|--------|
| Section padding (vertical) | 120–180px | 80–100px |
| Section padding (horizontal) | 48px | 24px |
| Card internal padding | 40–56px | 20–24px |
| Grid gap (card borders) | 2px (creates dark line between cards) | 2px |
| Grid gap (content) | 48–80px | 32–48px |
| Nav padding | 24px 40px | 16px 20px |
| Component spacing | 16–32px | 12–24px |
| Footer padding | 64px 48px | 48px 24px |

### Grid Patterns

**Hero:** 2-column, 50/50 split. Left = cream text content, Right = yellow geometric animation area. Stacks vertically on mobile (yellow on top).

**What Cards:** 3-column grid with 2px gap (dark background shows through as thin borders). 1-column on mobile.

**For Section:** 2x3 animated card grid using absolute positioning with percentage-based coordinates. Cards smoothly transition between layout permutations every 5 seconds. Static 2-column grid on mobile.

**Space Section:** 2-column, even split, 80px gap. Interactive visual left, text content right. 1-column stacked on mobile.

**Footer:** 3-column grid + full-width bottom row. 1-column on mobile.

### Responsive Breakpoints

```
Desktop:     > 768px   — full interactive features, multi-column layouts
Tablet:      ≤ 768px   — stacked layouts, hamburger menu, touch hints
Small phone: ≤ 480px   — single column everything, reduced sizing
```

### Max Widths

- Manifesto: 900px
- For-grid: 1100px
- CTA subtext / journey sub: 480px
- No explicit site-wide max-width (sections are full-bleed)

---

## Component Patterns

### Cards (What Section)

```
- Cream background, transitions to yellow on hover (0.5s)
- Large decorative number (01, 02, 03) in top-right corner, yellow-light color, fades on hover
- Circular icon container: 56px, 1.5px border, centered icon
- Icon container inverts on hover (dark background, cream icon)
- Body text in --mid color, weight 300
```

### Cards (For Section — Dark)

```
- Dark semi-transparent background: rgba(27, 27, 27, 0.88)
- Cream text on dark
- Yellow-bordered circular icon (40px)
- Compact state: description fades out, icon shrinks
- 3px border-radius
- Smooth position transitions: 3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Tags / Pills

```
- Space Mono, 10px, uppercase, 1.5px letter-spacing
- Pill shape: border-radius 999px
- 1.5px solid border in --dark
- Padding: 8px 16px
- Hover: yellow background, yellow border
```

### Buttons (CTA)

```
- Space Mono, 13px, uppercase, 2px letter-spacing
- Dark background, cream text
- Padding: 20px 56px
- Offset border effect: 2px solid border translated 6px right and 6px down
- Hover: border offset resets to 0,0; background becomes yellow, text becomes dark
- No border-radius (sharp corners)
```

### Navigation

```
- Fixed position, full width
- mix-blend-mode: difference (auto-adjusts contrast against any background)
- Logo left, links right
- Mobile: hamburger button with animated X transformation
- Mobile overlay: full-screen dark (rgba 0.97 opacity), centered links
```

### Footer

```
- Dark background, cream text
- 3-column: brand + tagline | links column | connect column
- Column headers: Space Mono, yellow, uppercase
- Links: 0.6 opacity, brighten on hover
- Bottom row spans full width, separated by subtle white border (8% opacity)
```

---

## Animation & Motion

### Principles

1. **Restrained but alive** — animations should feel like the page is breathing, not performing
2. **Ease-in-out is the default** — smooth, organic curves
3. **Slow durations** — 2s to 10s for ambient animations. Nothing frantic.
4. **Transitions are 0.3–0.5s** — fast enough to feel responsive, slow enough to feel smooth
5. **Scroll reveal is subtle** — 40px translateY + opacity fade over 0.8s

### Keyframe Animations

| Name | Duration | Description |
|------|----------|-------------|
| `wobble` | 4s, infinite | Hero "o" rotates ±3 degrees. Playful, subtle. |
| `breathe` | 6s, infinite | Large circles scale 1 → 1.08 → 1. Organic pulse. |
| `solar-flare` | 10s, infinite | Middle circle morphs border-radius between circle and organic blob shapes while scaling. |
| `bounce` | 2s, infinite | Down arrow pulses 8px vertically. |
| `scroll-left` | 30s, linear, infinite | Marquee translateX(-50%) for seamless horizontal loop. |
| `breathe-sm` | 6s, infinite | Small circle scales 1 → 1.06 → 1. |
| `dot-pulse` | 3s, infinite | Center dot in circle pulses opacity and scale. |
| `ring-expand` | 2.4s, infinite | Mobile tap hint rings expand outward (scale 1 → 4, opacity 0.6 → 0). |
| `core-breathe` | 1.8s, infinite | Mobile tap hint core glows brighter with box-shadow. |
| `hint-appear` | 0.6s, once | Tap hint entrance: scale 0.4 → 1, opacity 0 → 1. |
| `hint-float` | 2.2s, infinite | Tap hint bobs up and down 5px. |

### Interactive Effects

| Effect | Description |
|--------|-------------|
| **Cursor follower** | 16px yellow dot follows mouse with eased lag (0.12 multiplier). `mix-blend-mode: multiply`. Hidden on mobile. |
| **Scroll reveal** | `.reveal` elements start at `opacity: 0; translateY(40px)` and transition to visible when 15% in viewport. |
| **Card hover** | Background color transition (0.5s), icon inversion, number fade. |
| **Grid glow canvas** | Canvas-based effect: grid cells near cursor light up in yellow (`rgba(217, 184, 52, 0.35)`) and fade out (`0.92` decay per frame). |
| **Physics "1"** | The numeral "1" is repelled from the cursor via spring physics (configurable spring, damping, repel strength/radius). Bounces off edges. |
| **Rotating "0"** | Circle rotates continuously at 18 degrees/second. |
| **Layout shuffle** | For-section cards smoothly transition between 12 layout permutations every 5 seconds via `cubic-bezier(0.4, 0, 0.2, 1)`. |

### Transition Defaults

```css
/* Standard interaction */
transition: all 0.3s ease;

/* Background color changes */
transition: background 0.5s;

/* Scroll reveal */
transition: opacity 0.8s ease, transform 0.8s ease;

/* Card position (for-section) */
transition: left 3s cubic-bezier(0.4, 0, 0.2, 1),
            top 3s cubic-bezier(0.4, 0, 0.2, 1),
            width 3s cubic-bezier(0.4, 0, 0.2, 1),
            height 3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Texture & Effects

### Film Grain Overlay

A fixed-position `::before` pseudo-element on `body` renders a subtle noise texture across the entire page:

```css
/* SVG-based fractal noise at 4% opacity */
background-image: url("data:image/svg+xml,...feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'...");
opacity: 0.04;
pointer-events: none;
z-index: 9999;
```

This gives the entire site a warm, analog, slightly textured feel — like paper or film stock.

### Cursor

```css
body { cursor: crosshair; }  /* Desktop: technical, intentional */
body { cursor: auto; }       /* Mobile: standard */
```

### Text Selection

```css
::selection {
  background: var(--yellow);
  color: var(--dark);
}
```

---

## Iconography

- **Library:** Lucide React (open-source, consistent line icons)
- **Size:** 24–32px
- **Stroke width:** 1.5px
- **Style:** Outlined, minimal, geometric
- **Icons used:** DoorOpen, Cpu, Users, Paintbrush, Music, Cog, GraduationCap, Rocket, Compass

**No photographs or illustrations.** The visual language is purely typographic + geometric shapes + line icons. All decorative elements are CSS/SVG-generated (circles, dashed circles, triangles, squares, grid lines).

---

## Decorative Elements

| Element | Where | Description |
|---------|-------|-------------|
| Concentric circles | Hero right panel | 3 circles (400px, 270px, 140px). Outer: solid border, breathing. Middle: dashed border, solar-flare morphing. Inner: solid dark fill, breathing with delay. |
| Floating rotated text | Hero right panel | 10px Space Mono, uppercase, 50% opacity, rotated ±90° or horizontal |
| ※ symbol | Before manifesto | 28px, yellow, decorative section marker |
| Highlight underline | CTA heading | Yellow bar behind text, rotated -1deg, positioned at bottom of word |
| Background watermark | For section | "EVERYONE" in massive text (clamp 80–220px), 10% opacity, centered |
| Geometric shapes | CTA section | Circle outline, rotated square, triangle — all at 7% opacity |
| Grid lines | Space visual | CSS linear-gradient grid pattern, 40px spacing, 20% opacity |
| Decorative numbers | What cards | 01, 02, 03 in 64px Space Mono Bold, yellow-light |

---

## Voice & Copy Style

The copy is:
- **Conversational and direct** — "Walk in. Use the tools. Ask questions."
- **Short sentences** — punchy, not flowery
- **Inclusive without being saccharine** — "No gatekeeping, no prerequisites, no pitch decks."
- **Self-aware** — "Not a startup. Not an incubator. Just a really good garage."
- **Uses em dashes and fragments** — feels spoken, not written
- **Contractions always** — "don't", "it's", "you've"
- **Occasional wit** — "Good Vibes" as a tag alongside "Oscilloscopes"

---

## Technical Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript |
| Styling | Vanilla CSS (globals.css), CSS variables, no Tailwind utility classes in markup |
| Fonts | Google Fonts via `next/font` (DM Sans, Space Mono) |
| Icons | lucide-react |
| Deployment | Vercel |
| Analytics | @vercel/analytics |

---

## Quick Reference: Design Decisions

| Decision | Rationale |
|----------|-----------|
| Cream, not white | Warmer, less clinical. Feels like a workshop, not a hospital. |
| Yellow, not blue | Energy, spark, warmth. Hardware = making = fire = golden. |
| Only one accent color | Focus. Restraint. Everything yellow matters. |
| Space Mono for structure | Retro-technical feel. Monospace = code = engineering = precision. |
| DM Sans for voice | Geometric, modern, friendly. Not cold, not quirky. |
| Weight 300 for body | Elegant, breathable. Pairs well with bold 700 headings. |
| Film grain overlay | Analog warmth. Makes digital feel handmade. |
| No photographs | Let the visitor imagine themselves in the space. Typography and geometry carry the brand. |
| Crosshair cursor | "This is a workspace. You're here to make things." |
| mix-blend-mode nav | Nav stays readable over any background without conditional styling. |
| 2px dark gap between cards | Cards feel like separate physical objects, not just columns. |
| Breathing animations | The site feels alive but not demanding attention. |
| Physics-driven interaction | Demonstrates the spirit of the lab — play, experiment, tinker. |
