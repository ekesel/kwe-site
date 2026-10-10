import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp } from "@/motion";
import { Icon } from "../primitives";

/** Question / answer rows with hairlines (FAQ). */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  return (
    <FadeUp as="ul" className="rule-b">
      {items.map((f, k) => {
        const on = open === k;
        return (
          <li key={f.q} className="rule-t">
            <h3>
              <button type="button" onClick={() => setOpen(on ? null : k)} aria-expanded={on} aria-controls={`${uid}-${k}`}
                className="w-full flex items-start justify-between gap-6 py-6 text-left t-body font-medium text-forest-900">
                {f.q}<Icon name={on ? "minus" : "plus"} size={18} className="shrink-0 mt-1.5" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div id={`${uid}-${k}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.2, 0, 0.1, 1] }} className="overflow-hidden">
                  <p className="t-body text-ink-2 pb-6 max-w-[640px]">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </FadeUp>
  );
}
