import { useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { TextLink, usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { Statement } from "@/components/blocks/Statement";
import { ArticleGrid, PlainGrid } from "@/components/blocks/GridList";
import { ClearButton, Dropdown, FilterBar } from "@/components/filters";

export default function InsightsPage() {
  const data = useContent();
  const n = data.insights;
  usePageTitle(n.hero.eyebrow);
  const [topic, setTopic] = useState<string | null>(null);
  const [readTime, setReadTime] = useState<string | null>(null);
  const active = topic !== null || readTime !== null;
  const list = n.items.filter((x) => {
    if (topic && x.category !== topic) return false;
    if (readTime) { const m = parseInt(x.read, 10) || 0; if (readTime.startsWith("Under") ? m >= 6 : m < 6) return false; }
    return true;
  });
  return (
    <>
      <Hero title={n.hero.title} subtitle={n.hero.subtitle} />
      <Section id="content" label={n.hero.eyebrow}>
        <FilterBar>
          <Dropdown label={n.controls.categories} options={n.controls.categoriesOptions} value={topic} onChange={setTopic} />
          <Dropdown label={n.controls.filterOptions.label} options={n.controls.filterOptions.options} value={readTime} onChange={setReadTime} />
          <ClearButton label={n.controls.clear} show={active} onClick={() => { setTopic(null); setReadTime(null); }} />
        </FilterBar>
        <ArticleGrid items={list.map((x) => ({ key: x.slug, to: `/insight/${x.slug}`, image: x.image, eyebrow: x.category, title: x.title, meta: [x.date, x.read].filter(Boolean).join(" · ") }))} />
        {list.length === 0 && <p className="t-body text-ink-2">{n.controls.noResults}</p>}
      </Section>

      <Section label={n.controls.tagPrimary}>
        <Statement text={n.follow.statement} action={<TextLink href={data.site.linkedin} external>{n.follow.button}</TextLink>} />
      </Section>

      <Section label={n.follow.mediaLabel}>
        <PlainGrid items={n.follow.contacts.map((ct) => ({ key: ct.label, title: ct.label, lines: [<a href={`mailto:${ct.value}`} className="inline-link">{ct.value}</a>] }))} />
      </Section>
    </>
  );
}
