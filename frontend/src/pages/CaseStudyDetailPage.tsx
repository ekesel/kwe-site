import { useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Article } from "@/components/blocks/Article";
import { Section } from "@/components/blocks/Section";
import { ArticleGrid } from "@/components/blocks/GridList";
import { RichText, slugify } from "@/components/richtext";
import NotFoundPage from "./NotFoundPage";

export default function CaseStudyDetailPage() {
  const data = useContent();
  const c = data.caseStudies;
  const { slug } = useParams();
  const cs = c.items.find((x) => x.slug === slug);
  usePageTitle(cs?.title);
  if (!cs) return <NotFoundPage />;
  const d = c.detail;
  const others = c.items.filter((x) => x.slug !== slug);
  const part = (eyebrow: string, heading: string) => (
    <>
      <p className="t-eyebrow text-ink-2 mt-16 first:mt-0">{eyebrow}</p>
      <h2 id={slugify(heading)} className="t-h2 text-forest-900 mt-4 mb-10 scroll-mt-28">{heading}</h2>
    </>
  );
  return (
    <>
      <Hero tag={cs.category} title={cs.title} subtitle={cs.subtitle} />
      <Article contentKey={cs.slug} back={{ to: "/case-studies", label: d.back }}
        meta={d.meta.map((label, i) => ({ label, value: cs.meta[i] ?? "" })).filter((m) => m.value)}
        outline={{ label: data.insights.article.outline, glossaryLabel: data.insights.article.glossary }}>
        {part(d.challenge, cs.challenge.heading)}
        <RichText text={cs.challenge.body} />
        {part(d.approach, cs.approach.heading)}
        <ol className="rule-b">
          {cs.approach.steps.map((a, i) => (
            <li key={a.title} className="rule-t py-10 grid grid-cols-[48px_1fr] gap-x-6">
              <span className="t-small tabular-nums text-ink-2 pt-1">{String(i + 1).padStart(2, "0")}</span>
              <div><h3 className="t-body font-medium text-forest-900 mb-4">{a.title}</h3><RichText text={a.body} /></div>
            </li>
          ))}
        </ol>
        {part(d.results, cs.results.heading)}
        <RichText text={cs.results.body} />
      </Article>
      {others.length > 0 && (
        <Section label={d.moreEyebrow} title={d.moreTitle}>
          <ArticleGrid cols={2} items={others.map((o) => ({ key: o.slug, to: `/case-study/${o.slug}`, image: o.image, eyebrow: o.category, title: o.cardTitle }))} />
        </Section>
      )}
    </>
  );
}
