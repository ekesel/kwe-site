import { FadeUp } from "@/motion";

/** A single row of figures separated by vertical hairlines (no cards). 2 per row on mobile, 3 on tablet, all on desktop. */
export function FigureRow({ items }: { items: { figure: string; label: string }[] }) {
  return (
    <FadeUp as="ul" stagger={0.08} className="figs">
      {items.map((s) => (
        <li key={s.label}>
          <div className="t-h2 text-forest-900 [.on-dark_&]:text-white tabular-nums">{s.figure}</div>
          <div className="t-small text-ink-2 [.on-dark_&]:text-white/70 mt-4">{s.label}</div>
        </li>
      ))}
    </FadeUp>
  );
}
