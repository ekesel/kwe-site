# KWE Advisors — website

React 19 + Vite + TypeScript + Tailwind CSS v4 + React Router + Framer Motion.
Responsive at desktop (1440), tablet (768) and mobile (390), matching the Figma prototype.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build locally
```

## Editing content — `src/data.json`

**All copy, links, image and video URLs live in `src/data.json`.** No component needs to change to edit text.

| Key | What it controls |
| --- | --- |
| `site` | brand name, tagline, email, LinkedIn URL, **hero video + poster image** |
| `nav`, `footer`, `cta` | navigation links, footer columns, the CTA band on every page |
| `home` | every Home section in order (hero, intro, stats, who we work with, challenge, traditional vs KWE, what we do, approach, team, testimonials, insights) |
| `story`, `team`, `process` | Our Story, Our Team (members + profile pages), Our Process (stepper, why KWE, timeline, FAQ) |
| `solutions.items[]` | the three solution pages — `slug` is the URL (`/solution/<slug>`) |
| `caseStudies.items[]` | case studies — `slug` → `/case-study/<slug>`; `extraCards` are the placeholder cards in the grid |
| `insights.items[]` | articles — `slug` → `/insight/<slug>`; `extraCards` as above |
| `contact`, `legal`, `notFound` | Contact (form, offices, media contacts), Legal, 404 |

Images are plain URLs (currently Unsplash). To use your own, drop files in `public/` and set the URL to `/filename.jpg`.
Icons on cards are referenced by name (`target`, `people`, `doc`, `bank`, `globe`, `leaf`, `map`, `star`, `layers`, `check`, `puzzle`, `clock`, `chat`, `link`) — defined in `src/components/ui.tsx`.

## Routes

`/` · `/story` · `/team` · `/team/:slug` · `/process` · `/solutions` · `/solution/:slug` · `/case-studies` · `/case-study/:slug` · `/insights` · `/insight/:slug` · `/contact` · `/legal` · `*` (404)

Deploy as a static SPA (Netlify / Vercel / S3+CloudFront): build `dist/` and add a rewrite of all paths to `index.html`.

## Filters & search

Team, Case Studies and Insights have working filters: dropdown pills (options come from `data.json`, e.g. `caseStudies.hero.filters[]`, `team.filters[]`, `insights.controls.categoriesOptions`), topic chips in the Insights hero, free-text "Search by name" on Team, "Clear filters", "Showing X of Y" and "Load more" (page size `controls.pageSize`). Items are matched on the fields named by each filter's `key` (e.g. `strategy`, `fundType`, `region`, `categoryGroup`, `team`, `focus`).

## Motion

The motion layer lives in `src/motion/index.tsx` (GSAP + ScrollTrigger + Lenis) and mirrors cinven.com's bundle — same easings (`joe.in/out/inOut`), timings and triggers:

- Lenis smooth scroll wired to ScrollTrigger; loader fade on first load; 0.4s page fade on route change.
- Shy header: nav hides on scroll down, returns on scroll up (0.4s joe.in/out).
- `<Lines>`: headings split into lines that rise in one after another (y 30, 0.8s, stagger 0.1, trigger top 90%).
- `<EyebrowDraw>`: eyebrow words stagger in (0.02) while the hairline under it draws left→right.
- `<FadeUp>`: generic fade-up (y 30 text / y 100 cards).
- `<Parallax>`: image drifts yPercent 18 while its section scrolls; hero video drifts yPercent 36 + scales 1.17 (`usePinnedMedia`).
- `<HorizontalScroll>`: card strip pins at centre and scrubs sideways, with a staggered rise-in on approach (Home testimonials, Case Studies perspectives).
- `<PinnedStack>`: stacked cards — each pins while the next slides over and the pinned one scales to 0.6 (Home approach steps).
- `useDriftGrid`: grid items drift at random speeds (Team grid). People columns scroll vertically on desktop (Home team).
- Solutions list: cinven "sectors" hover — rows dim, the hovered row's image reveals (opacity .6s / transform .5s).
- Hovers: button icon colour swap (0.3s), card images zoom 1.05, solution rows shift 16px, link underlines draw in (0.6s).
- Process stepper, FAQ accordion, carousels and the case-study slider are interactive.
- All of it respects `prefers-reduced-motion`.
- The contact form is front-end only — wire `onSubmit` in `src/pages/ContactPage.tsx` to your form backend.
