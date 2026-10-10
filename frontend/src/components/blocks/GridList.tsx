import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FadeUp } from "@/motion";
import { InitialsPortrait, Media } from "../primitives";

export type Portrait = { key: string; to?: string; name: string; role?: string; meta?: string; image?: string };
export type ArticleCard = { key: string; to: string; image: string; eyebrow?: string; title: string; meta?: string };
export type PlainItem = { key: string; title: ReactNode; lines: ReactNode[] };

/** People: 4:5 grayscale portraits (or an initials placeholder in the same frame), name + role below, no overlays. */
export function PortraitGrid({ items, cols = 3 }: { items: Portrait[]; cols?: 3 | 4 }) {
  return (
    <FadeUp as="ul" stagger={0.06} className={`grid grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-x-6 gap-y-16`}>
      {items.map((p) => {
        const inner = (
          <>
            {p.image ? <Media src={p.image} alt="" ratio="4x5" portrait zoom={!!p.to} /> : <InitialsPortrait name={p.name} />}
            <h3 className="t-body font-medium text-forest-900 mt-6">{p.name}</h3>
            {p.role && <p className="t-small text-ink-2 mt-1">{p.role}</p>}
            {p.meta && <p className="t-small text-ink-2">{p.meta}</p>}
          </>
        );
        return <li key={p.key}>{p.to ? <Link to={p.to} className="block group">{inner}</Link> : inner}</li>;
      })}
    </FadeUp>
  );
}

/** Articles / case studies: 16:9 thumbnail, eyebrow, title, meta. */
export function ArticleGrid({ items, cols = 3 }: { items: ArticleCard[]; cols?: 2 | 3 }) {
  return (
    <FadeUp as="ul" stagger={0.06} className={`grid md:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""} gap-x-6 gap-y-16`}>
      {items.map((a) => (
        <li key={a.key}>
          <Link to={a.to} className="block group">
            <Media src={a.image} alt="" ratio="16x9" zoom />
            {a.eyebrow && <p className="t-eyebrow text-ink-2 mt-6">{a.eyebrow}</p>}
            <h3 className="t-body font-medium text-forest-900 mt-2 group-hover:underline underline-offset-4 decoration-1">{a.title}</h3>
            {a.meta && <p className="t-small text-ink-2 mt-2">{a.meta}</p>}
          </Link>
        </li>
      ))}
    </FadeUp>
  );
}

/** Plain text columns with a hairline on top (offices, contacts). */
export function PlainGrid({ items }: { items: PlainItem[] }) {
  return (
    <FadeUp as="ul" stagger={0.06} className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {items.map((it) => (
        <li key={it.key} className="rule-t pt-6">
          <h3 className="t-body font-medium text-forest-900">{it.title}</h3>
          <div className="t-small text-ink-2 mt-4 space-y-1">{it.lines.map((l, i) => (<div key={i}>{l}</div>))}</div>
        </li>
      ))}
    </FadeUp>
  );
}
