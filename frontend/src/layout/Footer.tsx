import { Link } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { ArrowRight, Logo } from "@/components/ui";

/** Site footer: one dark rounded panel — CTA block, link columns, bottom row (docs/footer-reference.jpg). */
export default function Footer() {
  const data = useContent();
  const { cta, footer } = data;
  const label = "text-[12px] lg:text-[13px] font-semibold uppercase tracking-[0.18em]";
  return (
    <footer className="container-x pb-4 md:pb-6 pt-16 lg:pt-24 bg-white">
      <div className="footer-panel max-w-[1440px] mx-auto rounded-[24px] overflow-hidden text-white">
        {/* (a) CTA */}
        <div className="px-6 md:px-10 lg:px-16 pt-14 md:pt-16 lg:pt-20 pb-14 lg:pb-[72px]">
          <div className={`${label} flex items-center gap-3 text-g6`}><span className="w-2 h-2 rounded-full bg-berry" />{cta.eyebrow}</div>
          <h2 className="serif text-white text-[36px] md:text-[46px] lg:text-[54px] mt-5 mb-0 max-w-[620px]" style={{ lineHeight: 1.08, letterSpacing: "-0.015em" }}>{cta.title}</h2>
          <p className="text-g5 text-[17px] lg:text-[19px] mt-6 mb-0 max-w-[460px]" style={{ lineHeight: 1.6 }}>{cta.body}</p>
          <Link to={cta.button.to} className="btn btn-accent mt-10 lg:mt-12 !text-[16px] lg:!text-[17px] !pl-8 !py-2 !pr-2">
            <span>{cta.button.label}</span><span className="ic !w-11 !h-11 lg:!w-12 lg:!h-12"><ArrowRight size={16} rotate={-45} /></span>
          </Link>
        </div>

        {/* (b) hairline, (c) columns */}
        <div className="border-t border-white/10 px-6 md:px-10 lg:px-16 pt-12 lg:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr] gap-x-10 gap-y-10 lg:gap-x-12">
            <div className="md:col-span-2 lg:col-span-1">
              <Link to="/" aria-label={data.site.name} className="inline-block no-underline"><Logo inverted size={34} /></Link>
              <p className="text-g4 text-[16px] lg:text-[17px] mt-6 mb-0 max-w-[260px]" style={{ lineHeight: 1.75 }}>{data.site.tagline}</p>
            </div>
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <div className={`${label} text-g4`}>{col.title}</div>
                <ul className="list-none p-0 m-0 mt-6 space-y-4">
                  {col.links.map((l) => {
                    const cls = "text-g6 hover:text-white text-[16px] lg:text-[17px] no-underline transition-colors";
                    const href = (l as { href?: string }).href; // CMS footer links may be external (href) instead of a route
                    return (
                      <li key={l.label} style={{ lineHeight: 1.35 }}>
                        {l.to ? <Link to={l.to} className={cls}>{l.label}</Link> : <a href={href} className={cls}>{l.label}</a>}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>

          {/* (d) hairline, (e) bottom row */}
          <div className="border-t border-white/10 mt-14 lg:mt-16 py-8 lg:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-g4 text-[14px] lg:text-[15px]">
            <p className="m-0">{footer.copyright}</p>
            <p className="m-0">
              <a href={`mailto:${footer.email}`} className="text-g4 hover:text-white no-underline transition-colors">{footer.email}</a>
              <span className="mx-2.5" aria-hidden>·</span>
              <a href={data.site.linkedin} target="_blank" rel="noreferrer" className="text-g4 hover:text-white no-underline transition-colors">{footer.linkedinLabel}</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
