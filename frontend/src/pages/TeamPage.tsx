import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { TextLink, usePageTitle } from "@/components/ui";
import { Marquee, Section, VideoHero } from "@/components/sections";
import { ClearButton, Dropdown, FilterState, SearchBox, matches } from "@/components/filters";
import { EyebrowDraw, FadeUp, Lines, Parallax, useDriftGrid } from "@/motion";

const SPAN: Record<number, string> = { 3: "lg:col-span-3", 4: "lg:col-span-4", 5: "lg:col-span-5", 6: "lg:col-span-6" };

export default function TeamPage() {
  const data = useContent();
  const t = data.team;
  usePageTitle(t.hero.eyebrow);
  const [filters, setFilters] = useState<FilterState>({ team: null, focus: null, region: null });
  const [q, setQ] = useState("");
  const active = q !== "" || Object.values(filters).some((v) => v !== null);
  const list = t.members.filter((m) => matches(m as unknown as Record<string, unknown>, filters, q, ["name", "role"]));
  const grid = useRef<HTMLDivElement>(null);
  useDriftGrid(grid);
  return (
    <>
      <VideoHero title={t.hero.title} subtitle={t.hero.subtitle} cueTarget="#people" />

      <Section id="people">
        <FadeUp className="flex flex-wrap items-center gap-3">
          {t.filters.map((f) => (<Dropdown key={f.key} label={f.label} options={f.options} value={filters[f.key]} onChange={(v) => setFilters((s) => ({ ...s, [f.key]: v }))} />))}
          <SearchBox value={q} onChange={setQ} placeholder={t.searchPlaceholder} />
          <ClearButton label={t.clear} show={active} onClick={() => { setFilters({ team: null, focus: null, region: null }); setQ(""); }} />
        </FadeUp>
        <motion.div layout ref={grid} className="grid md:grid-cols-2 lg:grid-cols-16 gap-x-4 lg:gap-x-6 gap-y-14 mt-12 items-start">
          <AnimatePresence mode="popLayout">
            {list.map((m, i) => (
              <motion.div key={m.slug} layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.8, ease: [0.2, 0, 0.1, 1], delay: i * 0.05 }} className={active ? "lg:col-span-4" : SPAN[m.span] ?? "lg:col-span-4"}>
                <Link to={`/team/${m.slug}`} className="card-hover block no-underline">
                  <Parallax className="img-zoom rounded-lg grad-dark" style={{ aspectRatio: "0.73" }} amount={10}>{m.image && <img src={m.image} alt={m.name} loading="lazy" />}</Parallax>
                  <div className="card-title text-g1 text-[22px] lg:text-[26px] mt-5" style={{ lineHeight: 1.15, letterSpacing: "-0.01em" }}>{m.name}</div>
                  <div className="text-gm text-[16px] mt-1.5">{m.role}</div>
                  <div className="text-g3 text-[15px] mt-1.5">{m.credential}</div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="text-gm mt-12">{t.noResults}</p>}
      </Section>

      <Section>
        <Marquee duration={30} items={t.priorFirms.map((f) => (<span key={f} className="serif text-g3 text-[32px] lg:text-[44px] mr-16 lg:mr-24 whitespace-nowrap">{f}</span>))} />
      </Section>

      <Section>
        <FadeUp className="panel grad-dark text-white flex flex-col items-center text-center lg:p-20">
          <EyebrowDraw dark line={false}>{t.matters.eyebrow}</EyebrowDraw>
          <Lines as="p" className="serif text-white text-[24px] md:text-[30px] lg:text-[40px] mt-6 mb-8 max-w-[760px]" style={{ lineHeight: 1.2 }}>{t.matters.statement}</Lines>
          <TextLink to={t.matters.link.to} tone="light">{t.matters.link.label}</TextLink>
        </FadeUp>
      </Section>
    </>
  );
}
