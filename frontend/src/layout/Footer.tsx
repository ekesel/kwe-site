import { Link } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { Button, Label, Logo } from "@/components/primitives";

/** Footer: CTA block, link columns, bottom row — on the deep forest background with dark hairlines. */
export default function Footer() {
  const data = useContent();
  const { cta, footer } = data;
  return (
    <footer className="text-white on-dark" style={{ background: "linear-gradient(180deg, #0C2E26 0%, #071F1A 100%)" }}>
      <div className="wrap section-full !pb-10">
        {/* CTA */}
        <div className="grid-12 gap-y-6">
          <div className="lead-col"><Label className="text-sage-300">{cta.eyebrow}</Label></div>
          <div className="main-col">
            <h2 className="t-h2 text-white max-w-[720px]">{cta.title}</h2>
            <p className="t-body text-white/70 mt-6 max-w-[520px]">{cta.body}</p>
            <div className="mt-10"><Button to={cta.button.to} variant="light">{cta.button.label}</Button></div>
          </div>
        </div>

        {/* columns */}
        <div className="grid-12 gap-y-10 rule-t mt-24 pt-16">
          <div className="lead-col">
            <Link to="/" aria-label="KWE Advisors — home" className="inline-block text-white"><Logo size={28} /></Link>
            <p className="t-small text-white/70 mt-6 max-w-[260px]">{data.site.tagline}</p>
          </div>
          <div className="main-col grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="t-eyebrow text-sage-300">{col.title}</h2>
                <ul className="mt-6 space-y-3">
                  {col.links.map((l) => {
                    const href = (l as { href?: string }).href; // CMS footer links may be external (href) instead of a route
                    const cls = "t-small text-white/80 hover:text-white transition-colors";
                    return <li key={l.label}>{l.to ? <Link to={l.to} className={cls}>{l.label}</Link> : <a href={href} className={cls}>{l.label}</a>}</li>;
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* bottom row */}
        <div className="rule-t mt-16 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 t-small text-white/70">
          <p>{footer.copyright}</p>
          <p>
            <a href={`mailto:${footer.email}`} className="text-sage-300 hover:text-white transition-colors">{footer.email}</a>
            <span className="mx-3" aria-hidden>·</span>
            <a href={data.site.linkedin} target="_blank" rel="noreferrer" className="text-sage-300 hover:text-white transition-colors">{footer.linkedinLabel}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
