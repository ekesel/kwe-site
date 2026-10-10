import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArticleOutline } from "../outline";
import { Icon } from "../primitives";

/**
 * Detail-page layout (Cinven article): meta row with hairlines, outline (top-level headings) in columns 1–3,
 * a narrow text column in 4–10. Pass `outline` to build the outline from the rendered h2s.
 */
export function Article({ back, meta, outline, aside, children, contentKey }: {
  back?: { to: string; label: string }; meta?: { label: string; value: string }[]; contentKey: string;
  outline?: { label: string; glossaryLabel: string }; aside?: ReactNode; children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <div id="content" className="wrap section-full">
      <div className="grid-12 gap-y-10">
        <div className="lead-col">
          {back && <Link to={back.to} className="tlink"><Icon name="arrow" size={14} className="rotate-180" />{back.label}</Link>}
        </div>
        {meta && meta.length > 0 && (
          <dl className="main-col grid grid-cols-2 md:grid-cols-4 rule-t rule-b">
            {meta.map((m) => (<div key={m.label} className="py-4 pr-6"><dt className="t-eyebrow text-ink-2">{m.label}</dt><dd className="t-small text-forest-900 mt-2">{m.value}</dd></div>))}
          </dl>
        )}
        <aside className="lead-col lg:sticky lg:top-28 self-start flex flex-col gap-10">
          {outline && <ArticleOutline articleRef={ref} label={outline.label} glossaryLabel={outline.glossaryLabel} contentKey={contentKey} />}
          {aside}
        </aside>
        <article ref={ref} className="text-col">{children}</article>
      </div>
    </div>
  );
}
