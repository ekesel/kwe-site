import type { ReactNode } from "react";
import { Lines, FadeUp } from "@/motion";
import { Label } from "../primitives";

/**
 * The one section frame every block lives in (docs/design-system.md → Grid / Section hand-off):
 * hairline across the content width, label in columns 1–3, heading + content in columns 4–12.
 * `dark` makes it the page's single forest-950 band (full-bleed, no hairline).
 */
export function Section({ id, label, index, title, intro, children, dark = false, headingLevel = 2, className = "" }: {
  id?: string; label?: string; index?: string; title?: ReactNode; intro?: ReactNode; children?: ReactNode;
  dark?: boolean; headingLevel?: 1 | 2; className?: string;
}) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id={id} className={`${dark ? "bg-forest-950 text-white on-dark" : ""} ${className}`}>
      <div className={`wrap ${dark ? "section-full" : "section"}`}>
        <div className={`grid-12 gap-y-6 pt-6 ${dark ? "" : "rule-t"}`}>
          <div className="lead-col">{label && <FadeUp><Label as={title ? "span" : "h2"} index={index} className={dark ? "text-sage-300" : "text-ink-2"}>{label}</Label></FadeUp>}</div>
          <div className="main-col">
            {title && (typeof title === "string"
              ? <Lines as={H} className={`${headingLevel === 1 ? "t-h1" : "t-h2"} ${dark ? "text-white" : "text-forest-900"} max-w-[880px]`}>{title}</Lines>
              : <H className={`${headingLevel === 1 ? "t-h1" : "t-h2"} ${dark ? "text-white" : "text-forest-900"} max-w-[880px]`}>{title}</H>)}
            {intro && <FadeUp className={`t-body ${dark ? "text-white/70" : "text-ink-2"} ${title ? "mt-6" : ""} max-w-[640px]`}>{intro}</FadeUp>}
            {children && <div className={title || intro ? "mt-16" : ""}>{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
