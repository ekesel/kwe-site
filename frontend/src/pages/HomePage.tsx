import { useContent } from "@/content/ContentProvider";
import { TextLink, usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { Statement } from "@/components/blocks/Statement";
import { FigureRow } from "@/components/blocks/FigureRow";
import { FullBleedImage } from "@/components/blocks/FullBleedImage";
import { ListColumns } from "@/components/blocks/ListColumns";
import { NumberedRows } from "@/components/blocks/NumberedRows";
import { DataTable } from "@/components/blocks/DataTable";
import { FeatureSplit } from "@/components/blocks/FeatureSplit";
import { ArticleGrid, PortraitGrid } from "@/components/blocks/GridList";
import { Quote } from "@/components/blocks/Quote";
import { FadeUp } from "@/motion";

export default function HomePage() {
  const data = useContent();
  const h = data.home;
  usePageTitle();
  const feature = data.caseStudies.items[0];
  const show = data.site.flags.showTestimonials;
  return (
    <>
      <Hero title={h.hero.title} subtitle={h.hero.subtitle} />

      <Section id="content" label={h.intro.eyebrow}>
        <Statement text={h.intro.statement} action={<TextLink to={h.intro.link.to}>{h.intro.link.label}</TextLink>} />
      </Section>

      <Section label={h.stats.eyebrow} title={h.stats.title}>
        <FigureRow items={h.stats.items} />
      </Section>

      <FullBleedImage src={h.who.groups[0].tiles[0].image} />

      <Section label={h.who.eyebrow} title={h.who.title}>
        <ListColumns groups={h.who.groups.map((g) => ({ label: g.label, items: g.tiles.map((t) => t.label) }))} />
      </Section>

      <Section label={h.challenge.eyebrow} title={h.challenge.title} intro={h.challenge.body}>
        <NumberedRows rows={h.challenge.items.map((it) => ({ title: it.title, body: it.body }))} />
      </Section>

      <Section title={h.comparison.title}>
        <DataTable caption={h.comparison.title} head={["", h.comparison.traditionalLabel, h.comparison.kweLabel]}
          rows={h.comparison.rows.map((r) => ({ key: r.label, cells: [r.label, r.traditional, <span className="text-forest-900">{r.kwe}</span>] }))} />
      </Section>

      {/* the page's one dark band */}
      <Section dark label={h.whatWeDo.eyebrow} title={h.whatWeDo.title} intro={h.whatWeDo.body}>
        <NumberedRows large rows={h.whatWeDo.cards.map((c) => ({ index: c.n, title: c.title, to: c.to, image: c.image, body: <><span className="block t-small text-sage-300 mb-2">{c.subtitle}</span>{c.body}</> }))} />
      </Section>

      <Section label={h.caseStudies.eyebrow} title={h.caseStudies.title}>
        <FeatureSplit image={feature.image} to={`/case-study/${feature.slug}`} eyebrow={feature.category} title={feature.title} body={feature.subtitle}
          action={<div className="flex flex-wrap gap-x-10 gap-y-4"><TextLink to={`/case-study/${feature.slug}`}>{h.caseStudies.link.label}</TextLink><TextLink to="/case-studies">{data.caseStudies.detail.back}</TextLink></div>} />
      </Section>

      <Section label={h.team.eyebrow} title={h.team.title} intro={h.team.subtitle}>
        <PortraitGrid items={data.team.members.map((m) => ({ key: m.slug, to: `/team/${m.slug}`, name: m.name, role: m.role, image: m.image }))} />
        <FadeUp className="mt-16"><TextLink to={h.team.link.to}>{h.team.link.label}</TextLink></FadeUp>
      </Section>

      {show && (
        <Section label={h.testimonials.eyebrow} title={h.testimonials.title}>
          <Quote items={h.testimonials.items.map((t) => ({ text: t.quote, name: t.name, role: t.role, firm: t.firm }))} />
        </Section>
      )}
      {show && (
        <Section label={h.testimonials.trustedEyebrow} title={h.testimonials.trustedTitle}>
          <FadeUp as="ul" className="flex flex-wrap rule-t rule-b">
            {h.testimonials.logos.map((l) => (<li key={l.name} className="t-body text-forest-900 py-6 pr-10">{l.name}</li>))}
          </FadeUp>
        </Section>
      )}

      <Section label={h.insights.label} title={h.insights.title}>
        <ArticleGrid items={data.insights.items.map((a) => ({ key: a.slug, to: `/insight/${a.slug}`, image: a.image, eyebrow: a.category, title: a.title, meta: [a.date, a.read].filter(Boolean).join(" · ") }))} />
        <FadeUp className="mt-16"><TextLink to={h.insights.button.to}>{h.insights.button.label}</TextLink></FadeUp>
      </Section>
    </>
  );
}
