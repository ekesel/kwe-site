# KWE Advisors — design system

One composed editorial site, built from the structural language of cinven.com (reference screenshots in
`docs/reference/`, captured 2026-10-10 at 1440 and 390). Nothing of Cinven's is copied — only the structure:
a left-hand label with a short rule, content set far to the right on the same edge all the way down, very generous
whitespace, a single dark band carrying large type-only lists, and image-left / text-right features. Where Cinven
uses colour cards and rounded panels, KWE deliberately does not: sections are separated by space and hairlines only.

## Grid
- 12 columns, gutter 24px, content max 1312px (1440 incl. margins). Side margins 64 (≥1024) / 40 (≥768) / 20.
- **Header pattern, every section:** a 1px hairline across the content width, then the section label (eyebrow, optionally
  a number) in columns 1–3 and the heading + content in columns 4–12. Below 1024 the label sits above the content and
  both use the full width — the left edge is still shared.
- Long-form text (detail pages): columns 4–10, body max 640px. The outline / meta sits in columns 1–3.

## Type
| Token | Font | 1440 | 768 | 390 | Used for |
|---|---|---|---|---|---|
| display | Hedvig Letters Serif | 96 / 1.05 | 64 | 44 | hero heading only |
| h1 | Hedvig Letters Serif | 72 / 1.05 | 52 | 38 | page title on pages without a video hero (team profile, 404) |
| h2 | Hedvig Letters Serif | 48 / 1.1 | 36 | 28 | section headings, statements, quotes, feature titles, figures, large (dark-band) row titles |
| body | Inter | 18 / 30 | 18 / 30 | 16 / 26 | paragraphs, row titles (medium), table cells |
| small | Inter | 14 / 22 | | | captions, meta, buttons, footer links |
| eyebrow | Inter 500, uppercase, +12% | 12 | | | section labels, tags |

Serif headings track −1.5%. At most three serif sizes exist at any breakpoint (a page uses two: display or h1, plus h2);
everything else is one of the three Inter sizes. Row titles are body-size Inter 500, never a fourth heading size.
Section labels are eyebrows; when a section has no title, its label is the section's `h2` (still eyebrow-styled).
Figures sit at h2 size because five of them must fit across columns 4–12.

## Spacing rhythm
Scale: 8 · 16 · 24 · 40 · 64 · 96 · 160 — nothing else. Section padding 160 / 96 / 72 (desktop / tablet / mobile).
Inside a section: label→heading 0 (same row), heading→content 64, row padding 40, paragraph gap 24.

## Section hand-off
Sections sit on `paper` and hand off through whitespace + the hairline that opens the next section's header —
never a box, never a change of background. A page may use **one** dark band (`forest-950`) for its most important list
(e.g. "What we do"); it runs full-bleed, has no hairline, and the next section starts on paper again. Full-bleed images
are used as pauses between sections (16:9). Maximum two background colours per page plus the footer.

## Colour
paper `#F6F5F0` · ink `#0F1B18` · ink-2 `#4A5A55` · rule `#D5DBD5` · forest-950 `#071F1A` · forest-900 `#0C2E26` ·
forest-700 `#164A3C` · emerald-600 `#1E6A52` · sage-300 `#A9C4B4` · sage-100 `#E4ECE6` · white.
Headings forest-900, body ink, secondary ink-2. On forest: headings white, body white/72%, links sage-300.
Accent (emerald-600 on light, sage-300 on dark) is reserved for links, primary buttons, focus rings, the active filter
and the outline highlight. No shadows; no gradients except image/video overlays and the footer's vertical fade.

## Images
Rectangles with radius 0, either full-bleed or locked to grid columns; aspect 16:9, 4:5 or 1:1 only. One grade:
`saturate(.75)` + a forest-950 overlay at 25%; portraits are grayscale. Every image scales from 1.08 to 1 as it scrolls
through the viewport. Hover zoom only on images inside links.

## Links and buttons
- Text link (the default action): Inter 14/500, accent colour, arrow, underline draws left→right on hover (0.6s).
- Primary button (form submit, footer CTA only): pill, emerald-600 / white text (on dark: white / forest-900 text).
- Filters: outlined pills, active = emerald-600 fill.
- Numbered rows that link: the whole row is the link; the title shifts 8px and the arrow fills on hover.

## Motion
Lenis smooth scroll; headings reveal line by line (0.8s, `joe.out`, stagger 0.08) and are re-split by a
ResizeObserver until they have played, then restored to plain text; blocks fade up 24px once (0.8s); images
scale-on-scroll; the header hides on scroll down and returns on scroll up. Nothing pins, scrolls sideways, drifts
or loops while the reader is reading. `prefers-reduced-motion` disables all of it.

## Blocks (`frontend/src/components/blocks/`)
`Section` (header pattern) · `Statement` · `NumberedRows` · `FigureRow` · `FullBleedImage` · `FeatureSplit` ·
`GridList` (portraits / articles / plain) · `ListColumns` · `Quote` · `DataTable` · `Article` (meta row + outline + prose).
Every page is composed from these; pages contain no bespoke section styling.
