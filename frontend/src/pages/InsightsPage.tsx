import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { Hairline, Icon } from "@/components/ui";
import { CTABand, NewsCard, Section, VideoHero } from "@/components/sections";
import { ClearButton, Dropdown } from "@/components/filters";
import { FadeUp } from "@/motion";

type Card = { to: string; image: string; title: string; category: string; read: string; date: string };

export default function InsightsPage() {
  const data = useContent();
  const n = data.insights;
  const all: Card[] = useMemo(() => [
    ...n.items.map((x) => ({ to: `/insight/${x.slug}`, image: x.image, title: x.title, category: x.category, read: x.read, date: x.date })),
    ...n.extraCards.map((x) => ({ to: "/insights", image: x.image, title: x.title, category: x.category, read: x.read, date: x.date })),
  ], []);
  const [topic, setTopic] = useState<string | null>(null);
  const [readTime, setReadTime] = useState<string | null>(null);
  const [limit, setLimit] = useState(n.controls.pageSize);
  const active = topic !== null || readTime !== null;
  const list = all.filter((x) => {
    if (topic && x.category !== topic) return false;
    if (readTime) { const m = parseInt(x.read, 10) || 0; if (readTime.startsWith("Under") ? m >= 6 : m < 6) return false; }
    return true;
  });
  const shown = active ? list : list.slice(0, Math.max(limit, 3));
  const tags = (cat: string) => [{ label: n.controls.tagPrimary, dot: "#E3B341" }, { label: cat, dot: "#9CB5B9" }];
  const ratios = [0.8, 0.55, 0.8, 1.2, 0.8, 0.66];
  const reset = () => { setTopic(null); setReadTime(null); setLimit(n.controls.pageSize); };

  return (
    <>
      <VideoHero eyebrow={n.hero.eyebrow} title={n.hero.title} scrollCue={n.hero.scrollCue} cueTarget="#content">
        {n.hero.chips.map((ch) => (<button key={ch.label} type="button" onClick={() => { setTopic(ch.topic); setLimit(n.controls.pageSize); }} className={`pill-ghost cursor-pointer ${topic === ch.topic ? "active" : ""}`}>{ch.label}</button>))}
      </VideoHero>

      <Section id="content">
        <FadeUp className="flex flex-wrap items-center gap-3">
          <Dropdown label={n.controls.categories} options={n.controls.categoriesOptions} value={topic} onChange={(v) => { setTopic(v); setLimit(n.controls.pageSize); }} />
          <Dropdown solid label={n.controls.filter} options={n.controls.filterOptions.options} value={readTime} onChange={setReadTime} />
          <ClearButton label={n.controls.clear} show={active} onClick={reset} />
        </FadeUp>
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-16 gap-x-6 gap-y-12 mt-12 items-start">
          <AnimatePresence mode="popLayout">
            {shown.map((x, i) => {
              const span = !active && i === 0 ? "lg:col-span-8 md:col-span-2" : i < 3 && !active ? "lg:col-span-4" : "lg:col-span-5";
              return (
                <motion.div key={x.title} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, ease: [0.2, 0, 0.1, 1], delay: i * 0.05 }} className={span}>
                  <NewsCard to={x.to} image={x.image} title={x.title} tags={tags(x.category)} readMore={n.controls.readMore} big={!active && i === 0} ratio={active ? 0.8 : ratios[i % ratios.length]} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {shown.length === 0 && <p className="text-gm mt-12">{n.controls.noResults}</p>}
        <div className="flex flex-col items-center gap-4 mt-16">
          <span className="text-[13px] text-gm">{n.controls.showing.replace("{shown}", String(shown.length)).replace("{total}", String(list.length))}</span>
          {!active && shown.length < list.length && (
            <button type="button" onClick={() => setLimit((l) => l + n.controls.pageSize)} className="inline-flex items-center gap-3 rounded-full border border-g1 pl-6 pr-3 py-3 text-[16px] font-medium text-g1 bg-transparent cursor-pointer transition-colors hover:bg-g1 hover:text-white">
              {n.controls.loadMore}<span className="w-[30px] h-[30px] rounded-full bg-g1 text-white inline-flex items-center justify-center"><Icon name="plus" size={12} /></span>
            </button>
          )}
        </div>
      </Section>

      {/* Follow + media contact */}
      <Section>
        <FadeUp className="rounded-[24px] overflow-hidden">
          <div className="bg-g6 flex flex-col items-center text-center px-6 py-14 md:p-14 lg:p-24 gap-8">
            <p className="text-g1 text-[19px] md:text-[22px] lg:text-[28px] m-0 max-w-[700px]" style={{ lineHeight: 1.35 }}>{n.follow.statement}</p>
            <a href={data.site.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3.5 rounded-full bg-g1 text-white pl-6 pr-3 py-3 text-[16px] font-medium no-underline hover:bg-g2 transition-colors">{n.follow.button}<span className="w-[30px] h-[30px] rounded-full bg-white text-g1 inline-flex items-center justify-center"><Icon name="linkedin" size={14} /></span></a>
          </div>
          <div className="bg-off grid lg:grid-cols-[5fr_2fr_9fr] gap-8 px-6 py-14 md:p-14 lg:p-24">
            <div><div className="text-[15px] font-medium uppercase tracking-[0.02em] text-g1">{n.follow.mediaLabel}</div><Hairline className="mt-3" color="#061B20" /></div>
            <div className="hidden lg:block" />
            <ul className="list-none p-0 m-0 space-y-5">
              {n.follow.contacts.map((ct) => (<li key={ct.label} className="flex items-center gap-3.5"><span className="w-[26px] h-[26px] rounded-full border border-g1 text-g1 inline-flex items-center justify-center shrink-0"><Icon name="chevron" size={12} /></span><span className="text-g1 text-[17px] lg:text-[19px]">{ct.label}&nbsp;&nbsp;·&nbsp;&nbsp;<a href={`mailto:${ct.value}`} className="text-g1">{ct.value}</a></span></li>))}
            </ul>
          </div>
        </FadeUp>
      </Section>

      <CTABand />
    </>
  );
}
