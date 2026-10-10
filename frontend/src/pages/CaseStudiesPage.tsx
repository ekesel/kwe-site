import { useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { ArticleGrid } from "@/components/blocks/GridList";
import { ClearButton, Dropdown, FilterBar, FilterState, matches } from "@/components/filters";

export default function CaseStudiesPage() {
  const data = useContent();
  const c = data.caseStudies;
  usePageTitle(c.hero.eyebrow);
  const empty: FilterState = { categoryGroup: null, ...Object.fromEntries(c.hero.filters.map((f) => [f.key, null])) };
  const [filters, setFilters] = useState<FilterState>(empty);
  const set = (k: string) => (v: string | null) => setFilters((f) => ({ ...f, [k]: v }));
  const active = Object.values(filters).some((v) => v !== null);
  const list = c.items.filter((x) => matches(x as unknown as Record<string, unknown>, filters));
  return (
    <>
      <Hero title={c.hero.title} subtitle={c.hero.subtitle} />
      <Section id="content" label={c.hero.eyebrow}>
        <FilterBar>
          <Dropdown label={c.controls.categories} options={c.controls.categoriesOptions} value={filters.categoryGroup} onChange={set("categoryGroup")} />
          {c.hero.filters.map((f) => (<Dropdown key={f.key} label={f.label} options={f.options} value={filters[f.key]} onChange={set(f.key)} />))}
          <ClearButton label={c.controls.clear} show={active} onClick={() => setFilters(empty)} />
        </FilterBar>
        <ArticleGrid items={list.map((x) => ({ key: x.slug, to: `/case-study/${x.slug}`, image: x.image, eyebrow: x.category, title: x.cardTitle, meta: x.subtitle }))} />
        {list.length === 0 && <p className="t-body text-ink-2">{c.controls.noResults}</p>}
        <p className="t-small text-ink-2 mt-16" aria-live="polite">{c.controls.showing.replace("{shown}", String(list.length)).replace("{total}", String(c.items.length))}</p>
      </Section>
    </>
  );
}
