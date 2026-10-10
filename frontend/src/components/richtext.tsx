import { Fragment, type ReactNode } from "react";

/** Slug for heading ids: "II. Competition Without Differentiation" → "ii-competition-without-differentiation". */
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "section";

/** **bold** → <strong>, single newlines → <br>. */
function inline(text: string): ReactNode {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) => (part.startsWith("**") && part.endsWith("**") ? <strong key={k} className="font-semibold text-forest-900">{part.slice(2, -2)}</strong> : part))}
    </Fragment>
  ));
}

/**
 * Renders the CMS "markdown-lite" used by legal pages, case studies and insights. Blocks are separated by a blank line:
 * "## " / "### " headings (with stable ids for the article outline), "- " bullet lines, "> " quote, anything else a paragraph.
 */
export function RichText({ text, size = "md", className = "" }: { text: string; size?: "sm" | "md"; className?: string }) {
  const body = size === "sm" ? "t-small text-ink-2" : "t-body text-ink";
  const seen = new Map<string, number>();
  const id = (t: string) => { const base = slugify(t); const n = seen.get(base) ?? 0; seen.set(base, n + 1); return n ? `${base}-${n + 1}` : base; };
  return (
    <div className={className}>
      {text.split(/\n\s*\n/).map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith("### ")) { const t = block.slice(4); return <h3 key={i} id={id(t)} className="t-body font-medium text-forest-900 mt-10 scroll-mt-28">{inline(t)}</h3>; }
        if (block.startsWith("## ")) { const t = block.slice(3); return <h2 key={i} id={id(t)} className="t-h2 text-forest-900 mt-16 first:mt-0 scroll-mt-28">{inline(t)}</h2>; }
        // pull quotes are outdented into the gutter on desktop
        if (block.startsWith("> ")) return <blockquote key={i} className="mt-10 lg:-ml-16 border-l-2 border-forest-900 pl-6 t-h2 text-forest-900">{inline(block.slice(2))}</blockquote>;
        const lines = block.split("\n");
        const bullets = lines.filter((l) => l.startsWith("- "));
        const prose = lines.filter((l) => !l.startsWith("- ")).join("\n");
        return (
          <div key={i} className="mt-6 first:mt-0">
            {prose && <p className={body}>{inline(prose)}</p>}
            {bullets.length > 0 && (
              <ul className={`${body} ${prose ? "mt-4" : ""} pl-5 list-disc space-y-2 marker:text-ink-2`}>
                {bullets.map((l, k) => (<li key={k}>{inline(l.slice(2))}</li>))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
