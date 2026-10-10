/* Cinven-style motion layer — GSAP + ScrollTrigger + Lenis.
   Easings and timings are lifted from cinven.com's bundle:
   joe.out = (0.2,0,0.1,1) · joe.in = (0.8,0,0.8,0.5) · joe.inOut = (0.333,0,0,1)
   fadeUp: y 30 → 0, opacity 0 → 1, 0.8s, stagger 0.1 (lines) / eyebrow words 0.02 */
import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("joe.in", "M0,0 C0.8,0 0.8,0.5 1,1");
CustomEase.create("joe.out", "M0,0 C0.2,0 0.1,1 1,1");
CustomEase.create("joe.inOut", "M0,0 C0.333,0 0,1 1,1");

export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

/* ───────── Lenis smooth scroll wired to ScrollTrigger ───────── */
let lenis: Lenis | null = null;
export function getLenis() { return lenis; }
export function SmoothScroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (reduced()) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; };
  }, []);
  useEffect(() => { lenis?.scrollTo(0, { immediate: true }); requestAnimationFrame(() => ScrollTrigger.refresh()); }, [pathname]);
  return null;
}
export function scrollToEl(target: string | HTMLElement, offset = -100) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) {
    // re-measure first and pass an absolute position: Lenis can hold a stale limit right after content renders
    lenis.resize();
    lenis.scrollTo(window.scrollY + el.getBoundingClientRect().top + offset, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
  }
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ───────── Shy header: hides on scroll down, shows on scroll up ───────── */
export function useShyHeader(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let last = 0, hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) { if (hidden) { hidden = false; gsap.to(el, { y: 0, duration: 0.4, ease: "joe.out" }); } last = y; return; }
      if (y > last + 4 && !hidden) { hidden = true; gsap.to(el, { y: "-140%", duration: 0.4, ease: "joe.in" }); }
      else if (y < last - 4 && hidden) { hidden = false; gsap.to(el, { y: 0, duration: 0.4, ease: "joe.out" }); }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
}

/* ───────── Split text into lines (SplitText-equivalent) ───────── */
function splitLines(el: HTMLElement) {
  const original = el.innerHTML;
  const text = el.textContent ?? "";
  el.innerHTML = text.split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? w : `<span class="w" style="display:inline-block">${w}</span>`)).join("");
  const words = Array.from(el.querySelectorAll<HTMLElement>("span.w"));
  const lines: HTMLElement[][] = [];
  let top: number | null = null;
  for (const w of words) { const t = w.offsetTop; if (top === null || Math.abs(t - top) > 2) { lines.push([]); top = t; } lines[lines.length - 1].push(w); }
  el.innerHTML = "";
  const lineEls = lines.map((ws) => {
    const outer = document.createElement("span"); outer.className = "sl"; outer.style.cssText = "display:block;overflow:hidden";
    const inner = document.createElement("span"); inner.className = "sl-in"; inner.style.cssText = "display:block;white-space:nowrap;will-change:transform"; // measured to fit: never re-wrap (shrink-to-fit parents narrow to the longest line)
    inner.textContent = ws.map((w) => w.textContent).join(" ");
    outer.appendChild(inner); el.appendChild(outer); return inner;
  });
  return { lines: lineEls, revert: () => { el.innerHTML = original; } };
}

/** Heading/paragraph whose lines rise in one after another (fadeUp split:'lines', stagger .08–.1). */
export function Lines({ as: Tag = "h2", children, className = "", style, stagger = 0.1, delay = 0, immediate = false, y = 30 }: {
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span"; children: ReactNode; className?: string; style?: CSSProperties; stagger?: number; delay?: number; immediate?: boolean; y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    // Lines are measured from the current layout, so they are only valid for this width and font. Until the reveal
    // plays, re-split when web fonts finish loading or the window resizes; once it has played, restore the original
    // text so it reflows naturally (otherwise desktop-width lines strand single words at narrower widths).
    let split: ReturnType<typeof splitLines> | null = null;
    let tw: gsap.core.Tween | null = null;
    let started = false, finished = false;
    const vars = { y: 0, opacity: 1, duration: 0.8, ease: "joe.out", stagger, delay };
    const finish = () => { finished = true; split?.revert(); split = null; };
    const setup = () => {
      tw?.scrollTrigger?.kill(); tw?.kill(); split?.revert();
      split = splitLines(el);
      gsap.set(split.lines, { y, opacity: 0 });
      const v = { ...vars, onStart: () => { started = true; }, onComplete: finish };
      tw = immediate ? gsap.to(split.lines, v) : gsap.to(split.lines, { ...v, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    };
    const remeasure = () => { if (!started && !finished) setup(); };
    let t: number | undefined;
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(remeasure, 150); };
    setup();
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) remeasure(); });
    window.addEventListener("resize", onResize);
    return () => { alive = false; window.clearTimeout(t); tw?.scrollTrigger?.kill(); tw?.kill(); window.removeEventListener("resize", onResize); split?.revert(); };
  }, [children, stagger, delay, immediate, y]);
  const T = Tag as "div";
  return <T ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>{children}</T>;
}

/** Generic fadeUp (ScrollTrigger start top 90%, once). y:30 for text, y:100 for cards. */
export function FadeUp({ children, className = "", style, y = 30, delay = 0, stagger = 0, immediate = false, as: Tag = "div" }: {
  children: ReactNode; className?: string; style?: CSSProperties; y?: number; delay?: number; stagger?: number; immediate?: boolean; as?: "div" | "section" | "li" | "ul" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    const targets = stagger ? Array.from(el.children) : [el];
    gsap.set(targets, { y, opacity: 0 });
    const vars = { y: 0, opacity: 1, duration: 0.8, ease: "joe.out", delay, stagger };
    const tw = immediate ? gsap.to(targets, vars) : gsap.to(targets, { ...vars, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [y, delay, stagger, immediate]);
  const T = Tag as "div";
  return <T ref={ref} className={className} style={style}>{children}</T>;
}

/** Cinven eyebrow: words rise in (stagger .02) and the hairline under it draws left→right. */
export function EyebrowDraw({ children, dark = false, dot = "g3", line = true, className = "" }: { children: string; dark?: boolean; dot?: "g3" | "none"; line?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    const words = el.querySelectorAll<HTMLElement>(".ew");
    const rule = el.querySelector<HTMLElement>(".er");
    gsap.set(words, { y: 30, opacity: 0 }); if (rule) gsap.set(rule, { xPercent: -100 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    tl.to(words, { y: 0, opacity: 1, stagger: 0.02, duration: 0.8, ease: "joe.out" }, 0);
    if (rule) tl.to(rule, { xPercent: 0, duration: 0.8, ease: "joe.out" }, 0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [children]);
  return (
    <div ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <span className={`eyebrow ${dark ? "dark" : ""}`}>
        {dot !== "none" && <span className="dot" />}
        {children.split(" ").map((w, i) => (<span key={i} className="ew inline-block">{w}</span>))}
      </span>
      {line && <span className="er block h-px mt-1.5" style={{ background: dark ? "rgba(255,255,255,.25)" : "#BAD1D8" }} />}
    </div>
  );
}

/* ───────── Scroll-scrubbed effects ───────── */
/** Image parallax: inner img travels yPercent 18 across the section (scrub). */
export function Parallax({ children, className = "", style, amount = 18 }: { children: ReactNode; className?: string; style?: CSSProperties; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    const inner = el.querySelector("img, video, .px-inner"); if (!inner) return;
    gsap.set(inner, { scale: 1 + amount / 100 * 1.4, transformOrigin: "center" });
    const tw = gsap.fromTo(inner, { yPercent: -amount / 2 }, { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [amount]);
  return <div ref={ref} className={`overflow-hidden ${className}`} style={style}>{children}</div>;
}

/** Hero media drifts (yPercent 36, scale 1.17) as the hero scrolls away — cinven .js-pinned. */
export function usePinnedMedia(ref: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced() || !isDesktop()) return;
    const inner = el.querySelector(".pin-inner"); if (!inner) return;
    const tw = gsap.to(inner, { yPercent: 36, scale: 1.17, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [ref]);
}

/** Horizontal card strip: pins at center and scrubs sideways (cinven .js-cards), with a staggered rise-in on approach. */
export function HorizontalScroll({ children, className = "", gap = 24 }: { children: ReactNode; className?: string; gap?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const w = wrap.current, t = track.current; if (!w || !t || reduced()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const items = Array.from(t.children) as HTMLElement[];
      const overflow = t.scrollWidth - w.clientWidth;
      const tl = gsap.timeline({ scrollTrigger: { trigger: w, start: "center center", end: `+=${Math.max(600, 200 * items.length)}`, scrub: true, pin: true, anticipatePin: 1 } });
      if (overflow > 0) tl.to(t, { x: -overflow, ease: "none" }, 0);
      const h = items[0]?.offsetHeight ?? 400;
      const intro = gsap.timeline({ scrollTrigger: { trigger: w, start: "top bottom+=240", end: "center center", scrub: true } });
      intro.fromTo(items, { y: h }, { y: 0, duration: 2, stagger: { amount: items.length / 4 } }, 0).fromTo(items, { x: Math.abs(overflow) }, { x: 0, ease: "none", duration: 2 + items.length / 4 }, 0);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); intro.scrollTrigger?.kill(); intro.kill(); };
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex lg:flex-nowrap flex-col lg:flex-row" style={{ gap }}>{children}</div>
    </div>
  );
}

/** Stacked pinned cards: each card pins while the next slides over it and the pinned one scales down (cinven .js-pinned-cards). */
export function PinnedStack({ children, className = "" }: { children: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const containers = Array.from(el.children) as HTMLElement[];
      const kills: (() => void)[] = [];
      for (let i = 0; i < containers.length - 1; i++) {
        const card = containers[i].firstElementChild as HTMLElement;
        const st = ScrollTrigger.create({ trigger: containers[i + 1], start: "top bottom", endTrigger: containers[containers.length - 1], end: "bottom bottom", pin: containers[i], pinSpacing: false });
        const tw = gsap.to(card, { scale: 0.6, opacity: 0.6, transformOrigin: "center top", ease: "none", scrollTrigger: { trigger: containers[i + 1], start: "top bottom", end: "bottom bottom", scrub: true } });
        kills.push(() => { st.kill(); tw.scrollTrigger?.kill(); tw.kill(); });
      }
      gsap.set(containers[containers.length - 1], { position: "relative", zIndex: 2 });
      return () => kills.forEach((k) => k());
    });
    return () => mm.revert();
  }, []);
  return <div ref={ref} className={className}>{children.map((c, i) => (<div key={i} className="lg:min-h-screen lg:flex lg:items-center">{c}</div>))}</div>;
}

/** Grid of images drifting at random speeds (cinven .js-grid-images). */
export function useDriftGrid(ref: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced() || !isDesktop()) return;
    const items = Array.from(el.children) as HTMLElement[];
    const tw = gsap.fromTo(items, { y: () => Math.random() * 120 }, { y: () => -Math.random() * 30, ease: "joe.out", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [ref]);
}

/* ───────── Loader + page transition ───────── */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const done = () => gsap.to(el, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => { el.style.display = "none"; } });
    if (document.readyState === "complete") setTimeout(done, 200); else { window.addEventListener("load", done, { once: true }); setTimeout(done, 2500); }
  }, []);
  return <div ref={ref} className="fixed inset-0 z-[100] bg-g1 flex items-center justify-center" aria-hidden><span className="text-white/60 text-sm tracking-[0.2em] uppercase">kwe advisors</span></div>;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el || reduced()) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "joe.out" });
    ScrollTrigger.refresh();
  }, [pathname]);
  return <div ref={ref}>{children}</div>;
}
