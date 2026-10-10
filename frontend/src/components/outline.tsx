import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToEl } from "@/motion";
import { Icon } from "./primitives";

type Entry = { id: string; text: string; ids: string[] };
const OFFSET = 110; // header height + breathing room
const isLetter = (t: string) => t.trim().length <= 2;

/**
 * Top-level (h2) sections of the rendered article. Single-letter headings (an A–Z glossary) are subheads, not
 * sections: consecutive ones are grouped into one entry that stays active anywhere inside the glossary.
 */
function useEntries(articleRef: RefObject<HTMLElement | null>, key: string, glossaryLabel: string) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState<string | null>(null);
  // useEffect (not layout): the <article> is a later sibling, so its ref is only attached once layout effects have run
  useEffect(() => {
    const els = Array.from(articleRef.current?.querySelectorAll<HTMLElement>("h2[id]") ?? []);
    const list: Entry[] = [];
    for (const el of els) {
      const text = el.textContent?.trim() ?? "";
      const prev = list[list.length - 1];
      if (isLetter(text) && prev && prev.text === glossaryLabel) prev.ids.push(el.id);
      else list.push({ id: el.id, text: isLetter(text) ? glossaryLabel : text, ids: [el.id] });
    }
    setEntries(list);
    setActive(list[0]?.id ?? null);
    if (!els.length) return;
    const owner = new Map(list.flatMap((e) => e.ids.map((id) => [id, e.id] as const)));
    // current = last heading whose top has passed the reading line (30% down the viewport)
    const pick = () => {
      const line = window.innerHeight * 0.3;
      let current = els[0];
      for (const el of els) { if (el.getBoundingClientRect().top - line <= 0) current = el; else break; }
      setActive(owner.get(current.id) ?? null);
    };
    // the observed band ends exactly at the reading line, so a heading crossing it always fires a callback
    const io = new IntersectionObserver(pick, { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] });
    els.forEach((el) => io.observe(el));
    // fallback for jumps (e.g. back to top) that skip past the observed band between frames
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(pick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", pick);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", pick); };
  }, [articleRef, key, glossaryLabel]);
  return { entries, active };
}

function OutlineList({ entries, active, onPick }: { entries: Entry[]; active: string | null; onPick: (id: string) => void }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState({ top: 0, height: 0 });
  useLayoutEffect(() => {
    const li = listRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(active ?? "")}"]`);
    if (li) setBar({ top: li.offsetTop, height: li.offsetHeight });
  }, [active, entries]);
  return (
    <ul ref={listRef} className="relative border-l border-rule">
      <span aria-hidden className="absolute -left-px w-[2px] bg-emerald-600 transition-[transform,height] duration-500" style={{ transform: `translateY(${bar.top}px)`, height: bar.height, transitionTimingFunction: "cubic-bezier(.2,0,.1,1)" }} />
      {entries.map((e) => {
        const on = e.id === active;
        return (
          <li key={e.id} data-id={e.id}>
            <a href={`#${e.id}`} aria-current={on ? "location" : undefined} onClick={(ev) => { ev.preventDefault(); onPick(e.id); }}
              className={`block py-2 pl-4 pr-2 t-small transition-colors duration-300 ${on ? "text-emerald-600 font-medium" : "text-ink-2 hover:text-forest-900"}`}>
              {e.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Google-Docs-style outline: sticky rail on desktop, "Contents" disclosure above the article on mobile. */
export function ArticleOutline({ articleRef, label, glossaryLabel, contentKey }: { articleRef: RefObject<HTMLElement | null>; label: string; glossaryLabel: string; contentKey: string }) {
  const { entries, active } = useEntries(articleRef, contentKey, glossaryLabel);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [contentKey]);
  if (!entries.length) return null;
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
        <div className="t-eyebrow text-ink-2 mb-4">{label}</div>
        <OutlineList entries={entries} active={active} onPick={go} />
      </nav>
      <nav aria-label={label} className="lg:hidden rule-t rule-b">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center justify-between gap-4 py-4 text-left">
          <span className="t-eyebrow text-forest-900">{label}</span>
          <Icon name="chevron" size={16} className={`text-forest-900 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.333, 0, 0, 1] }} className="overflow-hidden">
              <div data-lenis-prevent className="max-h-[50vh] overflow-y-auto pb-4"><OutlineList entries={entries} active={active} onPick={go} /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
