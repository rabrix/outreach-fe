**BEFORE WRITING ANY CODE:** Decide on a single, committed aesthetic direction. Not "clean and modern" — something specific: dark editorial with modern colors (luxury premium theme) accents, brutalist newspaper grid, organic cream/terracotta, cold industrial, etc. State it in one sentence before your first line of code. Every decision below should serve that direction.

---

**Task:** Build a [INSERT COMPONENT/PAGE — e.g., SaaS Analytics Dashboard / Onboarding Flow / Pricing Page].

---

**STRICT DIRECTIVES — violating any of these is a failure:**

**1. Typography — Contrast and Character:**
- Pick TWO fonts that create tension: one with personality (a serif, slab, or display font with visible character — not Playfair, not Instrument Serif, find something less obvious), one workhorse sans-serif for UI (Geist, DM Sans, or equivalent).
- Never use Inter alone. Never use a font just because it's "premium" — use it because it fits your stated aesthetic direction.
- Apply letter-spacing intentionally: `tracking-tighter` on heavy display text, `tracking-widest` on small all-caps kickers. Do NOT apply it uniformly.
- Establish a 3-level hierarchy: primary (size + weight), secondary (muted color), tertiary (smaller + muted). Every element should sit clearly on one of these levels.

**2. Color — Commit to a System:**
- Define exactly 3 roles before choosing any hex: Background, Surface, Accent.
- The accent must carry emotional weight — it's not decorative, it marks the single most important interactive element on each view.
- Avoid: blue-on-white defaults, purple-gradient-on-dark, gray-everything-with-one-pop-of-color. If your palette could belong to any SaaS, it's wrong.
- Use a subtle off-white or off-black instead of pure #fff / #000 — this removes the plastic feel more than any texture.

**3. Layout — Structural Tension:**
- Use a 60/40 or 70/30 column split as your base. Never a 50/50 grid unless you have a specific reason.
- Apply asymmetrical padding: cards get `pt-6 px-6 pb-10`, not uniform `p-6`.
- Two whitespace modes only: tight (gap-1 or gap-2 for related elements) and generous (gap-16+ for section breaks). No medium gaps.
- At least one element should break its container: a stat that overflows its card, a heading that bleeds to the edge, a decorative element with a negative margin.

**4. Icons — Contained, Never Naked:**
- Every icon lives in a styled container: matching border-radius to the surrounding UI, 8–10% opacity background tinted with the accent color, 1px border at 15% opacity.
- All icons: identical stroke-width (1.5px), identical size. Uniformity is the rule.
- No Lucide unless you have no other option. Prefer Phosphor or Radix Icons.

**5. Surfaces — Depth Without Shadows:**
- Replace box-shadows with layered borders and background shifts: a slightly lighter/darker background on hover tells the user more than a floating shadow.
- If you use shadows, tint them with the accent: `box-shadow: 0 24px 48px -12px rgba(accent, 0.08)`.
- Add a noise texture via SVG `feTurbulence` filter (baseFrequency 0.65, numOctaves 3, opacity 0.025) — not a CSS background-image hack. This is specific; do it properly.

**6. Motion — Purposeful, Not Decorative:**
- Every interactive element gets exactly one transition: `transition-all duration-200 ease-out`.
- Cards on hover: `translateY(-2px)` + border color shift.
- Page/section entry: staggered fade-up using `animation-delay` increments (50ms steps), not simultaneous pop-in.
- One "hero" animation only — something that communicates the product's core action (a number counting up, a progress bar filling, a chart drawing in). Not a spinner, not a pulse.

**7. Final Check — Run This Before Outputting:**
- Could this UI belong to a generic SaaS? If yes, change the font or accent color.
- Is every icon naked? If yes, wrap it.
- Are all shadows black/gray? If yes, tint them.
- Is there a 50/50 grid anywhere without intent? If yes, break it.
- Is there a medium gap (gap-4 to gap-8) between unrelated sections? Replace with gap-16.

Output complete, production-ready Next.js/Tailwind code only.