import { useContent } from "@/content/ContentProvider";
import { usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Article } from "@/components/blocks/Article";
import { RichText, slugify } from "@/components/richtext";

export default function LegalPage() {
  const data = useContent();
  const l = data.legal;
  usePageTitle(l.title);
  return (
    <>
      <Hero title={l.title} subtitle={l.updated} />
      <Article contentKey="legal" outline={{ label: data.insights.article.outline, glossaryLabel: data.insights.article.glossary }}>
        {l.sections.map((s) => (
          <div key={s.heading} className="mt-16 first:mt-0">
            <h2 id={slugify(s.heading)} className="t-h2 text-forest-900 mb-6 scroll-mt-28">{s.heading}</h2>
            <RichText text={s.body} />
          </div>
        ))}
      </Article>
    </>
  );
}
