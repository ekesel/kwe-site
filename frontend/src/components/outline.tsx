import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToEl } from "@/motion";
import { Icon } from "./ui";

type Heading = { id: string; text: string; level: 2 | 3 };
const OFFSET = 110; // fixed nav height + breathing room

/** Reads the article's rendered h2/h3s and tracks which one the reader is in (IntersectionObserver as the trigger). */
function useHeadings(articleRef: RefObject<HTMLElement | null>, key: string) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);
  // useEffect (not layout): the <article> is a later sibling, so its ref is only attached once layout effects have run
  useEffect(() => {
    const els = Array.from(articleRef.current?.querySelectorAll<HTMLElement>("h2[id], h3[id]") ?? []);
    setHeadings(els.map((el) => ({ id: el.id, text: el.textContent?.trim() ?? "", level: el.tagName === "H3" ? 3 : 2 })));
    setActive(els[0]?.id ?? null);
    if (!els.length) return;
    // current = last heading whose top has passed the reading line (30% down the viewport)
    const pick = () => {
      const line = window.innerHeight * 0.3;
      let current = els[0];
      for (const el of els) { if (el.getBoundingClientRect().top - line <= 0) current = el; else break; }
      setActive(current.id);
    };
    // the observed band ends exactly at the reading line, so a heading crossing it always fires a callback
    const io = new IntersectionObserver(pick, { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] });
    els.forEach((el) => io.observe(el));
    window.addEventListener("resize", pick);
    return () => { io.disconnect(); window.removeEventListener("resize", pick); };
  }, [articleRef, key]);
  return { headings, active };
}

function OutlineList({ headings, active, onPick }: { headings: Heading[]; active: string | null; onPick: (id: string) => void }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState({ top: 0, height: 0 });
  useLayoutEffect(() => {
    const li = listRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(active ?? "")}"]`);
    if (!li) return;
    setBar({ top: li.offsetTop, height: li.offsetHeight });
    // keep the active entry visible inside a scrolling panel (long outlines, e.g. an A–Z glossary)
    const panel = listRef.current?.closest<HTMLElement>("[data-outline-scroll]");
    if (panel && (li.offsetTop < panel.scrollTop || li.offsetTop + li.offsetHeight > panel.scrollTop + panel.clientHeight)) {
      panel.scrollTo({ top: li.offsetTop - panel.clientHeight / 2, behavior: "smooth" });
    }
  }, [active, headings]);
  return (
    <ul ref={listRef} className="relative list-none m-0 p-0 border-l border-silver">
      <span aria-hidden className="absolute -left-px w-[2px] bg-g1 rounded-full transition-[transform,height] duration-500" style={{ transform: `translateY(${bar.top}px)`, height: bar.height, transitionTimingFunction: "cubic-bezier(.2,0,.1,1)" }} />
      {headings.map((h) => {
        const on = h.id === active;
        return (
          <li key={h.id} data-id={h.id}>
            <a href={`#${h.id}`} aria-current={on ? "location" : undefined} onClick={(e) => { e.preventDefault(); onPick(h.id); }}
              className={`block py-2 pr-2 text-[14px] no-underline transition-colors duration-300 ${h.level === 3 ? "pl-8" : "pl-4"} ${on ? "text-g1 font-medium" : "text-gm hover:text-g1"}`} style={{ lineHeight: 1.4 }}>
              {h.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Glossary-style articles (every heading a single letter, e.g. the A–Z): the letters are an index, not sections,
 *  so they are shown as one compact grid instead of a long list. */
function LetterIndex({ headings, active, onPick }: { headings: Heading[]; active: string | null; onPick: (id: string) => void }) {
  return (
    <ul className="list-none m-0 p-0 grid grid-cols-7 gap-1.5">
      {headings.map((h) => {
        const on = h.id === active;
        return (
          <li key={h.id}>
            <a href={`#${h.id}`} aria-current={on ? "location" : undefined} onClick={(e) => { e.preventDefault(); onPick(h.id); }}
              className={`flex items-center justify-center h-9 rounded-lg text-[14px] font-medium no-underline transition-colors duration-300 ${on ? "bg-g1 text-white" : "text-gm hover:bg-off hover:text-g1"}`}>
              {h.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Google-Docs-style outline: sticky rail on desktop, "Contents" disclosure above the article on mobile. */
export function ArticleOutline({ articleRef, label, contentKey }: { articleRef: RefObject<HTMLElement | null>; label: string; contentKey: string }) {
  const { headings, active } = useHeadings(articleRef, contentKey);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [contentKey]);
  if (!headings.length) return null;
  const isIndex = headings.every((h) => h.text.length <= 2);
  const Body = isIndex ? LetterIndex : OutlineList;
  const go = (id: string) => {
    history.replaceState(null, "", `#${id}`);
    // on mobile the disclosure collapses above the article: scroll once it has (0.3s), or the target shifts up
    const delay = open ? 320 : 0;
    setOpen(false);
    window.setTimeout(() => { const el = document.getElementById(id); if (el) scrollToEl(el, -OFFSET); }, delay);
  };
  return (
    <>
      <nav aria-label={label} className="hidden lg:block">
        <div className="text-[13px] uppercase tracking-[0.08em] text-g3 font-medium mb-4">{label}</div>
        <div data-outline-scroll data-lenis-prevent className="max-h-[calc(100vh-15rem)] overflow-y-auto no-scrollbar pr-2">
          <Body headings={headings} active={active} onPick={go} />
        </div>
      </nav>
      <nav aria-label={label} className="lg:hidden rounded-2xl border border-silver">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-transparent border-0 cursor-pointer text-left">
          <span className="text-[13px] uppercase tracking-[0.08em] text-g1 font-medium">{label}</span>
          <Icon name="chevron" size={16} className={`text-g1 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.333, 0, 0, 1] }} className="overflow-hidden">
              <div data-outline-scroll data-lenis-prevent className="max-h-[50vh] overflow-y-auto px-5 pb-4">
                <Body headings={headings} active={active} onPick={go} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
