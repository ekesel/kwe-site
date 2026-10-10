import { Fragment, type ReactNode } from "react";

/** Slug for heading ids: "II. Competition Without Differentiation" → "ii-competition-without-differentiation". */
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "section";

/** **bold** → <strong>, single newlines → <br>. */
function inline(text: string): ReactNode {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) => (part.startsWith("**") && part.endsWith("**") ? <strong key={k} className="font-semibold text-g1">{part.slice(2, -2)}</strong> : part))}
    </Fragment>
  ));
}

/**
 * Renders the CMS "markdown-lite" used by legal pages, case studies and insights. Blocks are separated by a blank line:
 * "## " / "### " headings (with stable ids for the article outline), "- " bullet lines, "> " quote, anything else a paragraph.
 */
export function RichText({ text, size = "md", className = "" }: { text: string; size?: "sm" | "md"; className?: string }) {
  const body = size === "sm" ? "text-gm text-[16px]" : "text-g1 text-[17px] lg:text-[19px]";
  const seen = new Map<string, number>();
  const id = (t: string) => { const base = slugify(t); const n = seen.get(base) ?? 0; seen.set(base, n + 1); return n ? `${base}-${n + 1}` : base; };
  return (
    <div className={`rich ${className}`}>
      {text.split(/\n\s*\n/).map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith("### ")) { const t = block.slice(4); return <h3 key={i} id={id(t)} className="font-sans font-medium text-g1 text-[19px] lg:text-[22px] mt-10 mb-0 scroll-mt-28" style={{ lineHeight: 1.3 }}>{inline(t)}</h3>; }
        if (block.startsWith("## ")) { const t = block.slice(3); return <h2 key={i} id={id(t)} className="serif text-g1 text-[26px] lg:text-[34px] mt-14 first:mt-0 mb-0 scroll-mt-28" style={{ lineHeight: 1.2 }}>{inline(t)}</h2>; }
        if (block.startsWith("> ")) return <blockquote key={i} className="m-0 mt-8 border-l-[3px] border-g3 pl-6 serif text-g1 text-[21px] lg:text-[26px]" style={{ lineHeight: 1.35 }}>{inline(block.slice(2))}</blockquote>;
        const lines = block.split("\n");
        const bullets = lines.filter((l) => l.startsWith("- "));
        const prose = lines.filter((l) => !l.startsWith("- ")).join("\n");
        return (
          <div key={i} className="mt-6 first:mt-0">
            {prose && <p className={`${body} m-0`} style={{ lineHeight: 1.65 }}>{inline(prose)}</p>}
            {bullets.length > 0 && (
              <ul className={`${body} ${prose ? "mt-3" : ""} mb-0 pl-5 space-y-2.5 marker:text-g3`} style={{ lineHeight: 1.6 }}>
                {bullets.map((l, k) => (<li key={k}>{inline(l.slice(2))}</li>))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
