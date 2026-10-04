import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import data from "@/data";
import { Hairline, Icon } from "@/components/ui";
import { CTABand, NewsCard, Section, VideoHero } from "@/components/sections";
import { ClearButton, Dropdown, FilterState, matches } from "@/components/filters";
import { EyebrowDraw, FadeUp, HorizontalScroll, Lines } from "@/motion";

const c = data.caseStudies;
const tagsOf = (tags: string[]) => tags.map((t, i) => ({ label: t, dot: i === 0 ? "#E3B341" : "#9CB5B9" }));
type Card = { to: string; image: string; title: string; tags: string[]; strategy: string; fundType: string; region: string; categoryGroup: string };

export default function CaseStudiesPage() {
  const all: Card[] = useMemo(() => [
    ...c.items.map((x) => ({ to: `/case-study/${x.slug}`, image: x.image, title: x.cardTitle, tags: x.tags, strategy: x.strategy, fundType: x.fundType, region: x.region, categoryGroup: x.categoryGroup })),
    ...c.extraCards.map((x) => ({ to: "/case-studies", image: x.image, title: x.title, tags: x.tags, strategy: x.strategy, fundType: x.fundType, region: x.region, categoryGroup: x.categoryGroup })),
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
      <VideoHero eyebrow={c.hero.eyebrow} title={c.hero.title} subtitle={c.hero.subtitle} scrollCue={c.hero.scrollCue} cueTarget="#content">
        {c.hero.filters.map((f) => (<Dropdown key={f.key} dark label={f.label} options={f.options} value={filters[f.key]} onChange={set(f.key)} />))}
      </VideoHero>

      <Section id="content">
        <FadeUp className="flex flex-wrap items-center gap-3">
          <Dropdown label={c.controls.categories} options={c.controls.categoriesOptions} value={filters.categoryGroup} onChange={set("categoryGroup")} />
          <Dropdown solid label={c.controls.filter} options={c.hero.filters[0].options} value={filters.strategy} onChange={set("strategy")} />
          <ClearButton label={c.controls.clear} show={active} onClick={() => setFilters({ strategy: null, fundType: null, region: null, categoryGroup: null })} />
        </FadeUp>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-16 gap-x-6 gap-y-12 mt-12 items-start">
          <AnimatePresence mode="popLayout">
            {shown.map((x, i) => {
              const span = !active && i === 0 ? "lg:col-span-8 md:col-span-2" : i < 3 && !active ? "lg:col-span-4" : "lg:col-span-5";
              return (
                <motion.div key={x.title} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, ease: [0.2, 0, 0.1, 1], delay: i * 0.05 }} className={span}>
                  <NewsCard to={x.to} image={x.image} title={x.title} tags={tagsOf(x.tags)} readMore={c.controls.readMore} big={!active && i === 0} ratio={active ? 0.8 : ratios[i % ratios.length]} />
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

      {/* Client perspectives — pinned horizontal strip on desktop */}
      <Section bg="#FAFAFA">
        <div className="flex items-start justify-between gap-6">
          <div><FadeUp><EyebrowDraw dot="berry">{c.perspectives.eyebrow}</EyebrowDraw></FadeUp><Lines as="h2" className="t-h2 text-g1 mt-6 mb-0">{c.perspectives.title}</Lines></div>
          <span className="hidden md:inline-flex items-center gap-2 text-[12px] text-gm mt-2"><span className="w-1.5 h-1.5 rounded-full bg-berry" />{c.perspectives.note}</span>
        </div>
        <HorizontalScroll className="mt-12">
          {c.perspectives.items.map((q) => (
            <article key={q.firm} className="shrink-0 w-full md:w-[70vw] lg:w-[440px] rounded-2xl bg-white border border-silver p-7 lg:p-9 flex flex-col justify-between min-h-[300px] lg:min-h-[360px]">
              <p className="serif text-g1 text-[20px] lg:text-[24px] m-0" style={{ lineHeight: 1.3 }}>“{q.quote}”</p>
              <div className="mt-8"><div className="font-medium text-g1 text-[14px]">{q.name}</div><div className="text-gm text-[13px] mt-1">{q.firm}</div></div>
            </article>
          ))}
        </HorizontalScroll>
        <FadeUp className="mt-10"><Hairline /><p className="text-gl text-[12px] mt-4 mb-0 max-w-3xl" style={{ lineHeight: 1.5 }}>{c.perspectives.compliance}</p></FadeUp>
      </Section>

      {/* Trusted by */}
      <Section>
        <FadeUp><EyebrowDraw>{c.trusted.eyebrow}</EyebrowDraw></FadeUp>
        <FadeUp stagger={0.08} className="flex flex-wrap gap-x-12 gap-y-4 lg:gap-x-20 mt-8">
          {c.trusted.logos.map((l) => (<span key={l} className="serif text-g3 text-[28px] lg:text-[36px]">{l}</span>))}
        </FadeUp>
        <FadeUp><p className="text-gl text-[12px] mt-6 mb-0">{c.trusted.note}</p></FadeUp>
      </Section>

      <CTABand />
    </>
  );
}
