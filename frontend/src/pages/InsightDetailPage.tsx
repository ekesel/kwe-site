import { useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { Icon, usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Article } from "@/components/blocks/Article";
import { Section } from "@/components/blocks/Section";
import { ArticleGrid } from "@/components/blocks/GridList";
import { RichText } from "@/components/richtext";
import NotFoundPage from "./NotFoundPage";

export default function InsightDetailPage() {
  const data = useContent();
  const n = data.insights;
  const { slug } = useParams();
  const a = n.items.find((x) => x.slug === slug);
  usePageTitle(a?.title);
  if (!a) return <NotFoundPage />;
  const t = n.article;
  const related = n.items.filter((x) => x.slug !== slug).slice(0, 3);
  const share = (
    <div className="flex gap-2">
      <a href={data.site.linkedin} target="_blank" rel="noreferrer" aria-label="KWE Advisors on LinkedIn" className="w-10 h-10 rounded-full border border-rule text-forest-900 inline-flex items-center justify-center hover:bg-sage-100"><Icon name="linkedin" size={16} /></a>
      <button type="button" aria-label="Copy link" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="w-10 h-10 rounded-full border border-rule text-forest-900 inline-flex items-center justify-center hover:bg-sage-100"><Icon name="share" size={16} /></button>
    </div>
  );
  return (
    <>
      <Hero tag={a.category} title={a.title} subtitle={a.subtitle} />
      <Article contentKey={a.slug} back={{ to: "/insights", label: t.back }}
        meta={[{ label: t.metaLabels[0], value: a.date }, { label: t.metaLabels[1], value: a.read }, { label: t.metaLabels[2], value: t.author }].filter((m) => m.value)}
        outline={{ label: t.outline, glossaryLabel: t.glossary }} aside={<div className="hidden lg:block">{share}</div>}>
        <RichText text={a.body} />
        <div className="lg:hidden mt-16">{share}</div>
      </Article>
      {related.length > 0 && (
        <Section label={t.related}>
          <ArticleGrid items={related.map((r) => ({ key: r.slug, to: `/insight/${r.slug}`, image: r.image, eyebrow: r.category, title: r.title, meta: r.read }))} />
        </Section>
      )}
    </>
  );
}
