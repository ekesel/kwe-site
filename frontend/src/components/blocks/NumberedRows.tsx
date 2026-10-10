import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FadeUp } from "@/motion";
import { Icon, Media } from "../primitives";

export type Row = { index?: string; title: ReactNode; body?: ReactNode; extra?: ReactNode; to?: string; image?: string; key?: string };

/**
 * Numbered rows separated by hairlines — replaces cards everywhere.
 * Plain rows: number · title · body. Link rows (`to`): the whole row links, large serif title, and on desktop the
 * row's image is revealed beside the list on hover (the "sectors" pattern).
 */
export function NumberedRows({ rows, numbered = true, large = false }: { rows: Row[]; numbered?: boolean; large?: boolean }) {
  const [hover, setHover] = useState(0);
  const images = rows.map((r) => r.image).filter(Boolean) as string[];
  const linked = rows.some((r) => r.to);
  const list = (
    <ol className="rule-b">
      {rows.map((r, i) => {
        const n = r.index ?? String(i + 1).padStart(2, "0");
        const body = (
          <div className={`grid grid-cols-[48px_1fr] md:grid-cols-[64px_1fr] gap-x-6 gap-y-2 py-10 ${linked ? "pr-16 relative" : ""}`}>
            <span className="t-small tabular-nums text-ink-2 [.on-dark_&]:text-sage-300 pt-1">{numbered ? n : ""}</span>
            <div className={large ? "" : "md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-6"}>
              <h3 className={`row-title ${large ? "t-h2" : "t-body font-medium"} text-forest-900 [.on-dark_&]:text-white`}>{r.title}</h3>
              {(r.body || r.extra) && (
                <div className={`${large ? "mt-4 max-w-[560px]" : "mt-2 md:mt-0"} t-body text-ink-2 [.on-dark_&]:text-white/70`}>
                  {r.body}{r.extra}
                </div>
              )}
            </div>
            {r.to && <span className="row-arrow absolute right-0 top-10 w-10 h-10 rounded-full border border-current inline-flex items-center justify-center text-forest-900 [.on-dark_&]:text-sage-300"><Icon name="arrow" size={16} /></span>}
          </div>
        );
        return (
          <li key={r.key ?? n} className="rule-t">
            {r.to ? <Link to={r.to} className="row-link block" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)}>{body}</Link> : body}
          </li>
        );
      })}
    </ol>
  );
  if (!images.length) return <FadeUp>{list}</FadeUp>;
  return (
    <FadeUp className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] gap-6 lg:gap-16 items-start">
      {list}
      <div className="hidden lg:block sticky top-32 ratio-4x5 relative">
        {rows.map((r, i) => r.image && (
          <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: hover === i ? 1 : 0 }} aria-hidden={hover !== i}>
            <Media src={r.image} ratio="fill" className="h-full" />
          </div>
        ))}
      </div>
    </FadeUp>
  );
}
