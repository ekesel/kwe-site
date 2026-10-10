import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FadeUp } from "@/motion";
import { Media } from "../primitives";

/** Image left (4:5) / text right, inside the content columns. */
export function FeatureSplit({ image, eyebrow, title, body, action, to }: { image: string; eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode; to?: string }) {
  return (
    <FadeUp className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] gap-10 lg:gap-16 items-end">
      {to ? <Link to={to} tabIndex={-1} aria-hidden className="block"><Media src={image} ratio="4x5" zoom /></Link> : <Media src={image} ratio="4x5" />}
      <div>
        {eyebrow && <div className="t-eyebrow text-ink-2">{eyebrow}</div>}
        <h3 className="t-h2 text-forest-900 mt-4">{title}</h3>
        {body && <p className="t-body text-ink-2 mt-6">{body}</p>}
        {action && <div className="mt-10">{action}</div>}
      </div>
    </FadeUp>
  );
}
