import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./ui";

export type FilterDef = { label: string; key: string; options: string[] };
export type FilterState = Record<string, string | null>;

/** Dropdown pill. `dark` = glass pill (for dark backgrounds); otherwise outlined pill on light backgrounds.
 *  The listbox is portalled to <body> with fixed positioning: card grids below use transforms (GSAP/framer
 *  layout) and overflow-hidden image wrappers, which create stacking contexts that would otherwise paint over it. */
export function Dropdown({ label, options, value, onChange, dark = false, solid = false }: { label: string; options: string[]; value: string | null; onChange: (v: string | null) => void; dark?: boolean; solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number; maxHeight: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const place = useCallback(() => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    const below = window.innerHeight - r.bottom - 16, above = r.top - 16;
    const left = Math.max(12, Math.min(r.left, window.innerWidth - 232));
    setPos(below >= 260 || below >= above
      ? { left, top: r.bottom + 8, maxHeight: Math.max(160, below) }
      : { left, bottom: window.innerHeight - r.top + 8, maxHeight: Math.max(160, above) });
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("scroll", place, { passive: true }); window.addEventListener("resize", place);
    return () => { window.removeEventListener("scroll", place); window.removeEventListener("resize", place); };
  }, [open, place]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { const t = e.target as Node; if (!ref.current?.contains(t) && !listRef.current?.contains(t)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const active = value !== null;
  const base = dark
    ? `pill-ghost ${active ? "active" : ""}`
    : solid
      ? "inline-flex items-center gap-3 rounded-full bg-g1 pl-5 pr-3 py-3 text-[15px] font-medium text-white"
      : `inline-flex items-center gap-3 rounded-full border pl-5 pr-2.5 py-2.5 text-[16px] font-medium transition-colors ${active ? "bg-g1 text-white border-g1" : "border-g1 text-g1 bg-transparent"}`;
  const pick = (v: string | null) => { onChange(v); setOpen(false); };
  return (
    <div ref={ref} className="relative">
      <button type="button" className={`${base} cursor-pointer`} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span>{active ? value : label}</span>
        <span className={dark ? "" : `w-7 h-7 rounded-full inline-flex items-center justify-center ${solid || active ? "bg-white text-g1" : "bg-g1 text-white"}`}>
          <Icon name={solid ? "sliders" : "chevron"} size={12} className={`transition-transform duration-300 ${open && !solid ? "rotate-180" : ""}`} />
        </span>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.ul ref={listRef} role="listbox" aria-label={label} data-lenis-prevent initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: [0.2, 0, 0.1, 1] }}
              style={{ position: "fixed", left: pos.left, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}
              className="z-[45] min-w-[220px] overflow-y-auto list-none m-0 p-2 rounded-2xl bg-white border border-silver shadow-[0_20px_50px_rgba(6,27,32,.15)] text-left">
              <li><button type="button" onClick={() => pick(null)} className={`w-full text-left rounded-xl px-4 py-2.5 text-[15px] cursor-pointer bg-transparent border-0 hover:bg-off ${!active ? "text-g1 font-medium" : "text-gm"}`}>All</button></li>
              {options.map((o) => (
                <li key={o}><button type="button" onClick={() => pick(o)} className={`w-full text-left rounded-xl px-4 py-2.5 text-[15px] cursor-pointer bg-transparent border-0 hover:bg-off ${value === o ? "text-g1 font-medium" : "text-gm"}`}>{o}</button></li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder, dark = false }: { value: string; onChange: (v: string) => void; placeholder: string; dark?: boolean }) {
  return (
    <label className={`inline-flex items-center gap-3 px-2 py-2.5 ${dark ? "text-white" : "text-gm"}`}>
      <Icon name="search" size={18} className={dark ? "text-g5" : "text-g3"} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`bg-transparent border-0 outline-none text-[16px] w-[180px] md:w-[240px] ${dark ? "text-white placeholder:text-g5" : "text-g1 placeholder:text-gm"}`} />
    </label>
  );
}

export function ClearButton({ label, onClick, show, dark = false }: { label: string; onClick: () => void; show: boolean; dark?: boolean }) {
  if (!show) return null;
  return <button type="button" onClick={onClick} className={`text-[14px] underline bg-transparent border-0 cursor-pointer ${dark ? "text-g5 hover:text-white" : "text-gm hover:text-g1"}`}>{label}</button>;
}

/** Generic matcher: every active filter must equal the item's field; search matches any string field. */
export function matches<T extends Record<string, unknown>>(item: T, state: FilterState, search = "", searchKeys: (keyof T)[] = []) {
  for (const [k, v] of Object.entries(state)) { if (v !== null && item[k] !== v) return false; }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    return searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(q));
  }
  return true;
}
