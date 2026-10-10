import { useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { TextLink, usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { Statement } from "@/components/blocks/Statement";
import { PortraitGrid } from "@/components/blocks/GridList";
import { ClearButton, Dropdown, FilterBar, FilterState, SearchBox, matches } from "@/components/filters";
import { FadeUp } from "@/motion";

export default function TeamPage() {
  const data = useContent();
  const t = data.team;
  usePageTitle(t.hero.eyebrow);
  const empty: FilterState = Object.fromEntries(t.filters.map((f) => [f.key, null]));
  const [filters, setFilters] = useState<FilterState>(empty);
  const [q, setQ] = useState("");
  const active = q !== "" || Object.values(filters).some((v) => v !== null);
  const list = t.members.filter((m) => matches(m as unknown as Record<string, unknown>, filters, q, ["name", "role"]));
  return (
    <>
      <Hero title={t.hero.title} subtitle={t.hero.subtitle} cueTarget="#people" />

      <Section id="people" label={t.hero.eyebrow}>
        <FilterBar>
          {t.filters.map((f) => (<Dropdown key={f.key} label={f.label} options={f.options} value={filters[f.key]} onChange={(v) => setFilters((s) => ({ ...s, [f.key]: v }))} />))}
          <SearchBox value={q} onChange={setQ} placeholder={t.searchPlaceholder} />
          <ClearButton label={t.clear} show={active} onClick={() => { setFilters(empty); setQ(""); }} />
        </FilterBar>
        <PortraitGrid items={list.map((m) => ({ key: m.slug, to: `/team/${m.slug}`, name: m.name, role: m.role, meta: m.credential, image: m.image }))} />
        {list.length === 0 && <p className="t-body text-ink-2">{t.noResults}</p>}
      </Section>

      <Section label={t.profile.firmsLabel}>
        <FadeUp as="ul" className="flex flex-wrap rule-t rule-b">
          {t.priorFirms.map((f) => (<li key={f} className="t-body text-forest-900 py-6 pr-10">{f}</li>))}
        </FadeUp>
      </Section>

      <Section label={t.matters.eyebrow}>
        <Statement text={t.matters.statement} action={<TextLink to={t.matters.link.to}>{t.matters.link.label}</TextLink>} />
      </Section>
    </>
  );
}
