import { useContent } from "@/content/ContentProvider";
import { TextLink, usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { NumberedRows } from "@/components/blocks/NumberedRows";
import { DataTable, Mark } from "@/components/blocks/DataTable";

export default function SolutionsPage() {
  const data = useContent();
  const s = data.solutions;
  usePageTitle(s.hero.eyebrow);
  return (
    <>
      <Hero title={s.hero.title} subtitle={s.hero.subtitle} />

      <Section id="content" label={s.hero.eyebrow} title={s.whyKwe.title} intro={s.whyKwe.body} />

      {/* the page's one dark band: the capabilities, each revealing its image on hover */}
      <Section dark label={s.listEyebrow}>
        <NumberedRows large rows={s.items.map((it) => ({ index: it.n, title: it.title, to: `/solution/${it.slug}`, image: it.image, body: it.tagline }))} />
      </Section>

      <Section label={s.detailEyebrow} title={s.detailTitle}>
        <NumberedRows rows={s.items.map((it) => ({
          index: it.n, title: it.title,
          body: it.tagline,
          extra: (
            <>
              <ul className="mt-4 space-y-1 list-disc pl-5 marker:text-ink-2">{it.highlights.map((b) => (<li key={b}>{b}</li>))}</ul>
              <div className="mt-6"><TextLink to={`/solution/${it.slug}`}>{s.exploreLabel}</TextLink></div>
            </>
          ),
        }))} />
      </Section>

      <Section label={s.glance.eyebrow} title={s.glance.title}>
        <DataTable caption={s.glance.title} head={[s.glance.challengeHeader, ...s.glance.columns]}
          rows={s.glance.rows.map((r) => ({ key: r.label, cells: [r.label, ...r.cells.map((c, i) => <Mark key={i} on={c} label={s.glance.columns[i]} />)] }))} />
      </Section>
    </>
  );
}
