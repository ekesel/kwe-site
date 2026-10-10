import { useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { Statement } from "@/components/blocks/Statement";
import { NumberedRows } from "@/components/blocks/NumberedRows";
import { FullBleedImage } from "@/components/blocks/FullBleedImage";
import { ArticleGrid } from "@/components/blocks/GridList";
import NotFoundPage from "./NotFoundPage";

export default function SolutionDetailPage() {
  const data = useContent();
  const s = data.solutions;
  const { slug } = useParams();
  const it = s.items.find((x) => x.slug === slug);
  usePageTitle(it?.title);
  if (!it) return <NotFoundPage />;
  const others = s.items.filter((x) => x.slug !== slug);
  return (
    <>
      <Hero title={it.title} subtitle={[it.subtitle, it.lead]} />

      <Section id="content" label={s.overviewEyebrow}>
        <Statement text={`${it.overview.before}${it.overview.highlight}${it.overview.after}`} />
      </Section>

      <Section label={s.deliverEyebrow}>
        <NumberedRows rows={it.deliverables.map((d) => ({ title: d.title }))} />
      </Section>

      <Section label={s.expectEyebrow}>
        <NumberedRows rows={it.expect.map((e) => ({ title: e.title, body: e.body }))} />
      </Section>

      <FullBleedImage src={it.image} />

      <Section label={s.moreEyebrow} title={s.moreTitle}>
        <ArticleGrid cols={2} items={others.map((o) => ({ key: o.slug, to: `/solution/${o.slug}`, image: o.image, eyebrow: o.category, title: o.title, meta: o.cardBody }))} />
      </Section>
    </>
  );
}
