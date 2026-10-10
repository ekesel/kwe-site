import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { ArrowRight, Button, EASE_OUT, Eyebrow, Icon, Reveal, ScrollCue } from "./ui";
import { usePinnedMedia } from "@/motion";

/* ───────── Hero: the one hero used by every page — full-bleed video, centred heading + subheading, scroll cue ───────── */
export function VideoHero({ title, subtitle, tag, cueTarget = "#content" }: { title: string | string[]; subtitle?: string | string[]; tag?: string; cueTarget?: string }) {
  const data = useContent();
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  usePinnedMedia(heroRef);
  const lines = Array.isArray(title) ? title : [title];
  const subs = subtitle ? (Array.isArray(subtitle) ? subtitle : [subtitle]).filter(Boolean) : [];
  const rise = (delay: number) => ({ initial: reduced ? false : { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE_OUT, delay } });
  return (
    <section ref={heroRef} data-hero className="relative overflow-hidden bg-g1 text-white" style={{ minHeight: "100svh" }}>
      <div className="pin-inner absolute inset-0 will-change-transform"><video className="absolute inset-0 w-full h-full object-cover" src={data.site.heroVideo} poster={data.site.heroPoster} autoPlay muted loop playsInline aria-hidden /></div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,27,32,.6) 0%, rgba(6,27,32,.35) 45%, rgba(6,27,32,.7) 100%)" }} />
      <div className="relative container-x flex flex-col items-center text-center justify-center" style={{ minHeight: "100svh", paddingTop: 140, paddingBottom: 140 }}>
        {tag && (
          <motion.span {...rise(0.5)} className="mb-7 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-[13px] font-medium uppercase tracking-[0.06em] text-white" style={{ backdropFilter: "blur(12px)" }}>{tag}</motion.span>
        )}
        <h1 className="t-display m-0 max-w-[1100px]">
          {lines.map((l, i) => (<motion.span key={i} className="block" {...rise(0.6 + i * 0.1)}>{l}</motion.span>))}
        </h1>
        {subs.length > 0 && (
          <motion.p className="t-lead text-g6 mt-7 mb-0 max-w-[820px]" {...rise(0.85)}>
            {subs.map((s, i) => (<span key={i} className="block">{s}</span>))}
          </motion.p>
        )}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-7 lg:bottom-10"><ScrollCue label={data.home.hero.scrollCue} href={cueTarget} /></div>
    </section>
  );
}

/** Thin band directly under a detail-page hero: back link + key/value meta. */
export function MetaRow({ back, items }: { back: { to: string; label: string }; items: { label: string; value: string }[] }) {
  return (
    <div id="content" className="bg-g1 text-white container-x py-8 lg:py-10">
      <div className="max-w-[1312px] mx-auto flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-16">
        <Link to={back.to} className="inline-flex items-center gap-2.5 text-g5 text-[15px] no-underline hover:text-white transition-colors shrink-0"><ArrowRight rotate={180} size={14} />{back.label}</Link>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          {items.map((k) => (<div key={k.label}><div className="text-[12px] uppercase tracking-[0.08em] text-g5">{k.label}</div><div className="text-white text-[15px] lg:text-[17px] mt-2" style={{ lineHeight: 1.3 }}>{k.value}</div></div>))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Section wrapper ───────── */
export function Section({ id, children, className = "", bg }: { id?: string; children: ReactNode; className?: string; bg?: string }) {
  return (
    <section id={id} className={`section container-x ${className}`} style={bg ? { background: bg } : undefined}>
      <div className="max-w-[1312px] mx-auto">{children}</div>
    </section>
  );
}

/* ───────── Horizontal carousel with pager ───────── */
export function Carousel({ children, eyebrow, title, dark = false, className = "", gap = 24 }: { children: ReactNode[]; eyebrow?: string; title?: string; dark?: boolean; className?: string; gap?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const scrollBy = (dir: number) => {
    const el = ref.current; if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    const step = child ? child.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const on = () => setProgress(el.scrollWidth <= el.clientWidth ? 1 : (el.scrollLeft + el.clientWidth) / el.scrollWidth);
    on(); el.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { el.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  const fg = dark ? "text-white" : "text-g1";
  return (
    <div className={className}>
      {(eyebrow || title) && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            {eyebrow && <Eyebrow dark={dark} className="mb-5">{eyebrow}</Eyebrow>}
            {title && <h2 className={`t-h2 m-0 ${fg}`}>{title}</h2>}
          </div>
          <div className="flex gap-2">
            <button aria-label="Previous" onClick={() => scrollBy(-1)} className={`w-14 h-14 rounded-full border ${dark ? "border-white/30 text-white" : "border-silver text-g1"} inline-flex items-center justify-center transition-colors hover:bg-g1 hover:text-white hover:border-g1`}><ArrowRight rotate={180} size={18} /></button>
            <button aria-label="Next" onClick={() => scrollBy(1)} className="w-14 h-14 rounded-full bg-g1 text-white inline-flex items-center justify-center transition-colors hover:bg-g3"><ArrowRight size={18} /></button>
          </div>
        </div>
      )}
      <div ref={ref} className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory" style={{ gap }}>
        {children.map((c, i) => (<div key={i} className="snap-start shrink-0">{c}</div>))}
      </div>
      <div className={`mt-4 h-1.5 rounded-full ${dark ? "bg-white/15" : "bg-silver"}`}>
        <div className="h-full rounded-full bg-[#C9C5BE] transition-[width] duration-300" style={{ width: `${Math.max(10, Math.min(100, progress * 100))}%` }} />
      </div>
    </div>
  );
}

/* ───────── Marquee ───────── */
export function Marquee({ items, duration = 30, className = "" }: { items: ReactNode[]; duration?: number; className?: string }) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {[...items, ...items].map((it, i) => (<div key={i} className="shrink-0">{it}</div>))}
      </div>
    </div>
  );
}

/* ───────── Badge pills overlaid on card images ───────── */
export type BadgeTag = { label: string; dot: string };
export function Badges({ tags, className = "" }: { tags: BadgeTag[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((t) => (
        <span key={t.label} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.03em] text-white" style={{ background: "rgba(255,255,255,.22)", backdropFilter: "blur(16px)" }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.dot }} />{t.label}
        </span>
      ))}
    </div>
  );
}

/** Case-study badges: category + strategy (same pills on the Case Studies grid and the Home slider). */
export function caseBadges(c: { categoryGroup: string; strategy: string }): BadgeTag[] {
  return [{ label: c.categoryGroup, dot: "#E3B341" }, { label: c.strategy, dot: "#9CB5B9" }];
}

/* ───────── Cinven-style news/insight card ───────── */
export function NewsCard({ to, image, title, tags, readMore, big = false, ratio = 0.8 }: { to: string; image: string; title: string; tags: BadgeTag[]; readMore: string; big?: boolean; ratio?: number }) {
  return (
    <Link to={to} className="card-hover block no-underline group">
      <div className="img-zoom relative rounded-xl" style={{ aspectRatio: `1 / ${ratio}` }}>
        <img src={image} alt="" loading="lazy" />
        <Badges tags={tags} className="absolute left-3 bottom-3" />
      </div>
      <h3 className={`card-title font-sans font-normal text-g1 mt-5 mb-5 ${big ? "text-[24px] lg:text-[30px]" : "text-[20px] lg:text-[24px]"}`} style={{ lineHeight: 1.2, letterSpacing: "-0.01em" }}>{title}</h3>
      <span className="inline-flex items-center gap-2.5 rounded-full bg-off px-3.5 py-2.5 text-[14px] font-medium text-g1 transition-colors group-hover:bg-silver">{readMore}<ArrowRight size={12} /></span>
    </Link>
  );
}

/* ───────── Controls row (Categories / Filter) ───────── */
export function Controls({ categories, filter }: { categories: string; filter: string }) {
  return (
    <div className="flex gap-3">
      <button className="inline-flex items-center gap-3 rounded-full border border-g1 pl-5 pr-3 py-3 text-[15px] font-medium text-g1 bg-transparent">
        {categories}<span className="w-[26px] h-[26px] rounded-full bg-g1 text-white inline-flex items-center justify-center"><Icon name="chevron" size={12} /></span>
      </button>
      <button className="inline-flex items-center gap-3 rounded-full bg-g1 pl-5 pr-3 py-3 text-[15px] font-medium text-white">
        {filter}<span className="w-[26px] h-[26px] rounded-full bg-white text-g1 inline-flex items-center justify-center"><Icon name="sliders" size={12} /></span>
      </button>
    </div>
  );
}

export function LoadMore({ showing, label }: { showing: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 mt-16">
      <span className="text-[13px] text-gm">{showing}</span>
      <button className="inline-flex items-center gap-3 rounded-full border border-g1 pl-6 pr-3 py-3 text-[16px] font-medium text-g1 bg-transparent transition-colors hover:bg-g1 hover:text-white">
        {label}<span className="w-[30px] h-[30px] rounded-full bg-g1 text-white inline-flex items-center justify-center"><Icon name="plus" size={12} /></span>
      </button>
    </div>
  );
}

/* ───────── Stat tile ───────── */
export function StatTile({ big, small, label, dark = false }: { big: string; small?: string; label: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-7 lg:p-9 ${dark ? "bg-white/5" : "bg-off"}`}>
      <div className="flex items-baseline gap-1">
        <span className={`serif text-[40px] lg:text-[52px] leading-none ${dark ? "text-white" : "text-g1"}`}>{big}</span>
        {small && <span className="serif text-[22px] lg:text-[26px] leading-none text-g3">{small}</span>}
      </div>
      <p className={`mt-3 mb-0 text-[17px] leading-snug ${dark ? "text-g5" : "text-gm"}`}>{label}</p>
    </div>
  );
}

/* ───────── Pull quote ───────── */
export function PullQuote({ text, attribution, size = "lg" }: { text: string; attribution?: string; size?: "lg" | "md" }) {
  return (
    <blockquote className="m-0 border-l-[3px] border-g3 pl-7 lg:pl-10 py-2">
      <p className={`serif text-g1 m-0 ${size === "lg" ? "text-[22px] lg:text-[30px]" : "text-[21px] lg:text-[26px]"}`} style={{ lineHeight: 1.35 }}>“{text}”</p>
      {attribution && <footer className="text-gl text-[16px] mt-4">{attribution}</footer>}
    </blockquote>
  );
}
