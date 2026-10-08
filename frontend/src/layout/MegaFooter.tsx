import { Link } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { Button, Logo } from "@/components/ui";

export default function MegaFooter() {
  const data = useContent();
  const f = data.footer;
  return (
    <footer className="bg-g1 text-white container-x pt-16 pb-10 lg:pt-20">
      <div className="max-w-[1312px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-12 border-b border-g2">
          <div>
            <Link to="/" className="inline-block mb-4"><Logo inverted size={24} /></Link>
            <p className="text-g5 text-[15px] leading-relaxed max-w-[420px]">{data.site.tagline}</p>
          </div>
          <Button to={data.nav.cta.to} variant="ondark">{data.nav.cta.label}</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 py-12">
          {f.columns.map((col) => (
            <div key={col.title}>
              <div className="text-g3 text-xs font-medium tracking-[0.08em] uppercase mb-5">{col.title}</div>
              <ul className="space-y-3 list-none p-0 m-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"to" in l && l.to ? (
                      <Link to={l.to} className="text-g5 text-sm no-underline hover:text-white transition-colors">{l.label}</Link>
                    ) : (
                      <a href={(l as { href: string }).href} className="text-g5 text-sm no-underline hover:text-white transition-colors">{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-g2 pt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-gl text-xs leading-relaxed max-w-3xl m-0">{f.disclosure}</p>
          <p className="text-gl text-xs whitespace-nowrap m-0">{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
