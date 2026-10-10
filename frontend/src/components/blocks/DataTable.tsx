import type { ReactNode } from "react";
import { FadeUp } from "@/motion";

/** Clean table with hairlines; scrolls inside itself on narrow screens (never the page). */
export function DataTable({ head, rows, caption }: { head: ReactNode[]; rows: { key: string; cells: ReactNode[] }[]; caption?: string }) {
  return (
    <FadeUp className="overflow-x-auto no-scrollbar">
      <table className="w-full min-w-[560px] border-collapse text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="rule-b">{head.map((h, i) => (<th key={i} scope="col" className="t-eyebrow text-ink-2 font-medium py-4 pr-6 align-bottom">{h}</th>))}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="rule-b">
              {r.cells.map((c, i) => i === 0
                ? <th key={i} scope="row" className="t-body font-medium text-forest-900 py-6 pr-6 align-top">{c}</th>
                : <td key={i} className="t-body text-ink-2 py-6 pr-6 align-top">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </FadeUp>
  );
}

/** Tick / dash marks for capability tables (text alternative included). */
export function Mark({ on, label }: { on: boolean; label: string }) {
  return on
    ? <span className="inline-flex items-center gap-2 text-forest-900"><span className="w-2 h-2 rounded-full bg-forest-900" aria-hidden /><span className="sr-only">{label}: yes</span></span>
    : <span className="inline-flex items-center text-ink-2"><span className="w-3 h-px bg-current" aria-hidden /><span className="sr-only">{label}: no</span></span>;
}
