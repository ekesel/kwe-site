import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { scrollToEl, usePinnedMedia } from "@/motion";
import { Icon } from "../primitives";

const EASE: [number, number, number, number] = [0.2, 0, 0.1, 1];

/** The one hero used by every page: full-bleed video, centred heading + subheading, scroll cue. Detail pages add a tag. */
export function Hero({ title, subtitle, tag, cueTarget = "#content" }: { title: string | string[]; subtitle?: string | string[]; tag?: string; cueTarget?: string }) {
  const data = useContent();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  usePinnedMedia(ref);
  const lines = Array.isArray(title) ? title : [title];
  const subs = subtitle ? (Array.isArray(subtitle) ? subtitle : [subtitle]).filter(Boolean) : [];
  const rise = (delay: number) => ({ initial: reduced ? false : { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay } });
  return (
    <section ref={ref} data-hero className="relative overflow-hidden bg-forest-950 text-white on-dark" style={{ minHeight: "100svh" }}>
      <div className="pin-inner absolute inset-0"><video className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(.75)" }} src={data.site.heroVideo} poster={data.site.heroPoster} autoPlay muted loop playsInline aria-hidden /></div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,31,26,.55) 0%, rgba(7,31,26,.35) 45%, rgba(7,31,26,.75) 100%)" }} />
      <div className="relative wrap flex flex-col items-center text-center justify-center" style={{ minHeight: "100svh", paddingTop: 160, paddingBottom: 160 }}>
        {tag && <motion.span {...rise(0.4)} className="t-eyebrow mb-10 text-sage-300">{tag}</motion.span>}
        <h1 className="t-display max-w-[1120px]">
          {lines.map((l, i) => (<motion.span key={i} className="block" {...rise(0.5 + i * 0.1)}>{l}</motion.span>))}
        </h1>
        {subs.length > 0 && (
          <motion.p className="t-body text-white/80 mt-10 max-w-[640px]" {...rise(0.75)}>
            {subs.map((s, i) => (<span key={i} className="block">{s}</span>))}
          </motion.p>
        )}
      </div>
      <a href={cueTarget} onClick={(e) => { e.preventDefault(); scrollToEl(cueTarget, 0); }}
        className="tlink text-white absolute left-1/2 -translate-x-1/2 bottom-10">
        {data.home.hero.scrollCue}<Icon name="down" size={14} />
      </a>
    </section>
  );
}
