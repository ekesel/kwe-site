import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../primitives";

export type QuoteItem = { text: string; name?: string; role?: string; firm?: string };

/** One large serif quote at a time; prev/next when there are several. */
export function Quote({ items, labels = { prev: "Previous quote", next: "Next quote" } }: { items: QuoteItem[]; labels?: { prev: string; next: string } }) {
  const [i, setI] = useState(0);
  const q = items[i];
  const go = (d: number) => setI((i + d + items.length) % items.length);
  return (
    <figure>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: [0.2, 0, 0.1, 1] }}>
          <blockquote className="t-h2 text-forest-900">“{q.text}”</blockquote>
          {(q.name || q.firm) && (
            <figcaption className="mt-10 t-small text-ink-2">
              <span className="text-forest-900 font-medium">{q.name}</span>{q.role ? ` — ${q.role}` : ""}{q.firm ? `, ${q.firm}` : ""}
            </figcaption>
          )}
        </motion.div>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="mt-10 flex items-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className="w-10 h-10 rounded-full border border-forest-900 text-forest-900 inline-flex items-center justify-center hover:bg-sage-100"><Icon name="arrow" size={16} className="rotate-180" /></button>
          <button type="button" onClick={() => go(1)} aria-label={labels.next} className="w-10 h-10 rounded-full border border-forest-900 text-forest-900 inline-flex items-center justify-center hover:bg-sage-100"><Icon name="arrow" size={16} /></button>
          <span className="t-small text-ink-2 tabular-nums" aria-live="polite">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        </div>
      )}
    </figure>
  );
}
