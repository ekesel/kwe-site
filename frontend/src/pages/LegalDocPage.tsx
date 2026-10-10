import { useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Article } from "@/components/blocks/Article";
import { RichText, slugify } from "@/components/richtext";
import NotFoundPage from "./NotFoundPage";

export default function LegalDocPage() {
  const data = useContent();
  const { slug } = useParams();
  const doc = data.legal.documents.find((d) => d.slug === slug);
  usePageTitle(doc?.title);
  if (!doc) return <NotFoundPage />;
  return (
    <>
      <Hero title={doc.title} subtitle={doc.updated} />
      <Article contentKey={doc.slug} outline={{ label: data.insights.article.outline, glossaryLabel: data.insights.article.glossary }}
        aside={<p className="t-eyebrow text-forest-900 rule-t rule-b py-4" title={doc.complianceNote}>{data.legal.draftNote}</p>}>
        <RichText text={doc.intro} />
        {doc.sections.map((s) => (
          <div key={s.heading} className="mt-16">
            <h2 id={slugify(s.heading)} className="t-h2 text-forest-900 mb-6 scroll-mt-28">{s.heading}</h2>
            <RichText text={s.body} />
          </div>
        ))}
        <p className="t-small text-ink-2 rule-t pt-6 mt-16">{doc.disclaimer}</p>
      </Article>
    </>
  );
}
