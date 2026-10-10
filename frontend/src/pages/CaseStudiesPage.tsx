import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { Icon, usePageTitle } from "@/components/ui";
import { NewsCard, Section, VideoHero, caseBadges } from "@/components/sections";
import { ClearButton, Dropdown, FilterState, matches } from "@/components/filters";
import { FadeUp } from "@/motion";

type Card = { to: string; image: string; title: string; strategy: string; fundType: string; region: string; categoryGroup: string };

export default function CaseStudiesPage() {
  const data = useContent();
  const c = data.caseStudies;
  usePageTitle(c.hero.eyebrow);
  const all: Card[] = useMemo(() => [
    ...c.items.map((x) => ({ to: `/case-study/${x.slug}`, image: x.image, title: x.cardTitle, strategy: x.strategy, fundType: x.fundType, region: x.region, categoryGroup: x.categoryGroup })),
  ], []);
  const [filters, setFilters] = useState<FilterState>({ strategy: null, fundType: null, region: null, categoryGroup: null });
  const [limit, setLimit] = useState(c.controls.pageSize);
  const set = (k: string) => (v: string | null) => { setFilters((f) => ({ ...f, [k]: v })); setLimit(c.controls.pageSize); };
  const active = Object.values(filters).some((v) => v !== null);
  const list = all.filter((x) => matches(x, filters));
  const shown = active ? list : list.slice(0, Math.max(limit, 3));
  const ratios = [0.8, 0.55, 0.8, 1.2, 0.8, 0.66];

  return (
    <>
      <VideoHero title={c.hero.title} subtitle={c.hero.subtitle} />

      <Section id="content">
        <FadeUp className="flex flex-wrap items-center gap-3">
          <Dropdown label={c.controls.categories} options={c.controls.categoriesOptions} value={filters.categoryGroup} onChange={set("categoryGroup")} />
          {c.hero.filters.map((f) => (<Dropdown key={f.key} label={f.label} options={f.options} value={filters[f.key]} onChange={set(f.key)} />))}
          <ClearButton label={c.controls.clear} show={active} onClick={() => setFilters({ strategy: null, fundType: null, region: null, categoryGroup: null })} />
        </FadeUp>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-16 gap-x-6 gap-y-12 mt-12 items-start">
          <AnimatePresence mode="popLayout">
            {shown.map((x, i) => {
              const span = !active && i === 0 ? "lg:col-span-8 md:col-span-2" : i < 3 && !active ? "lg:col-span-4" : "lg:col-span-5";
              return (
                <motion.div key={x.title} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, ease: [0.2, 0, 0.1, 1], delay: i * 0.05 }} className={span}>
                  <NewsCard to={x.to} image={x.image} title={x.title} tags={caseBadges(x)} readMore={c.controls.readMore} big={!active && i === 0} ratio={active ? 0.8 : ratios[i % ratios.length]} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {shown.length === 0 && <p className="text-gm mt-12">{c.controls.noResults}</p>}

        <div className="flex flex-col items-center gap-4 mt-16">
          <span className="text-[13px] text-gm">{c.controls.showing.replace("{shown}", String(shown.length)).replace("{total}", String(list.length))}</span>
          {!active && shown.length < list.length && (
            <button type="button" onClick={() => setLimit((l) => l + c.controls.pageSize)} className="inline-flex items-center gap-3 rounded-full border border-g1 pl-6 pr-3 py-3 text-[16px] font-medium text-g1 bg-transparent cursor-pointer transition-colors hover:bg-g1 hover:text-white">
              {c.controls.loadMore}<span className="w-[30px] h-[30px] rounded-full bg-g1 text-white inline-flex items-center justify-center"><Icon name="plus" size={12} /></span>
            </button>
          )}
        </div>
      </Section>

    </>
  );
}
