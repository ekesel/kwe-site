import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./primitives";

export type FilterDef = { label: string; key: string; options: string[] };
export type FilterState = Record<string, string | null>;

/** Filter dropdown: outlined pill (emerald when a value is active).
 *  The listbox is portalled to <body> with fixed positioning: card grids below use transforms (GSAP/framer
 *  layout) and overflow-hidden image wrappers, which create stacking contexts that would otherwise paint over it. */
export function Dropdown({ label, options, value, onChange, allLabel = "All" }: { label: string; options: string[]; value: string | null; onChange: (v: string | null) => void; allLabel?: string }) {
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
  const pick = (v: string | null) => { onChange(v); setOpen(false); };
  return (
    <div ref={ref} className="relative">
      <button type="button" className={`pill ${active ? "is-active" : ""}`} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span>{active ? value : label}</span>
        <Icon name="chevron" size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.ul ref={listRef} role="listbox" aria-label={label} data-lenis-prevent initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: [0.2, 0, 0.1, 1] }}
              style={{ position: "fixed", left: pos.left, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}
              className="z-[45] min-w-[240px] overflow-y-auto py-2 bg-white border border-rule text-left">
              <li><button type="button" role="option" aria-selected={!active} onClick={() => pick(null)} className={`w-full text-left px-4 py-2 t-small hover:bg-sage-100 ${!active ? "text-emerald-600 font-medium" : "text-ink"}`}>{allLabel}</button></li>
              {options.map((o) => (
                <li key={o}><button type="button" role="option" aria-selected={value === o} onClick={() => pick(o)} className={`w-full text-left px-4 py-2 t-small hover:bg-sage-100 ${value === o ? "text-emerald-600 font-medium" : "text-ink"}`}>{o}</button></li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="inline-flex items-center gap-2 h-10 border-b border-forest-900 text-forest-900">
      <Icon name="search" size={16} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}
        className="bg-transparent border-0 outline-none t-small w-[180px] md:w-[220px] text-ink placeholder:text-ink-2" />
    </label>
  );
}

export function ClearButton({ label, onClick, show }: { label: string; onClick: () => void; show: boolean }) {
  if (!show) return null;
  return <button type="button" onClick={onClick} className="tlink">{label}</button>;
}

/** The controls row above every filtered grid. */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-x-4 gap-y-4 mb-16">{children}</div>;
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
