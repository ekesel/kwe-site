import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { ArrowRight, Backdrop, Button, Eyebrow, GRAD, Hairline, Icon, Reveal, TONE_BG, TONE_FG, TextLink, toneOverlay, usePageTitle } from "@/components/ui";
import { Badges, Marquee, NewsCard, Section, VideoHero, caseBadges } from "@/components/sections";
import { EyebrowDraw, FadeUp, HorizontalScroll, Lines, Parallax } from "@/motion";

const INSIGHT_COLS: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default function HomePage() {
  const data = useContent();
  const h = data.home;
  usePageTitle();
  return (
    <>
      <VideoHero title={h.hero.title} subtitle={h.hero.subtitle} />

      {/* Introduction — deep-green panel */}
      <section id="content" className="grad-green grain overflow-hidden container-x section text-white">
        <div className="max-w-[1312px] mx-auto grid lg:grid-cols-16 gap-6 lg:py-10">
          <FadeUp className="lg:col-span-4"><EyebrowDraw dark>{h.intro.eyebrow}</EyebrowDraw></FadeUp>
          <div className="lg:col-span-11 lg:col-start-6">
            <Lines as="p" className="t-h2 text-white m-0" stagger={0.08}>{h.intro.statement}</Lines>
            <FadeUp delay={0.3} className="mt-10"><Button to={h.intro.link.to} variant="ondark">{h.intro.link.label}</Button></FadeUp>
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <Section bg="#FAFAFA">
        <FadeUp><EyebrowDraw>{h.stats.eyebrow}</EyebrowDraw></FadeUp>
        <Lines as="h2" className="t-h2 text-g1 mt-6 mb-12 max-w-[820px]">{h.stats.title}</Lines>
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          {h.stats.items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} y={100} className={`relative overflow-hidden rounded-[20px] p-6 lg:p-8 flex flex-col justify-between aspect-[4/5] md:aspect-auto md:h-[260px] lg:h-[340px] md:col-span-2 lg:col-span-1 ${i >= 3 ? "md:col-span-3" : ""} ${i === 4 ? "col-span-2 aspect-auto h-[200px]" : ""}`} style={{ background: TONE_BG[s.tone], color: TONE_FG[s.tone] }}>
              <Backdrop src={s.image} overlay={toneOverlay(s.tone)} />
              <span className="relative serif text-[44px] md:text-[52px] lg:text-[56px] xl:text-[64px] leading-none" style={{ letterSpacing: "-0.02em" }}>{s.figure}</span>
              <span className="relative font-medium text-[16px] lg:text-[18px] leading-snug">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Who we work with */}
      <Section>
        <Reveal className="panel bg-off">
          <EyebrowDraw>{h.who.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h2 text-g1 mt-6 mb-12 max-w-[900px]">{h.who.title}</Lines>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-6">
            {h.who.groups.map((g, gi) => (
              <div key={g.label}>
                <div className="text-[13px] font-medium uppercase tracking-[0.08em] text-g3 mb-4">{g.label}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {g.tiles.map((t, i) => (
                    <Reveal key={t.label} delay={(gi * 3 + i) * 0.08} className="card-hover relative overflow-hidden rounded-xl p-5 flex items-end h-[150px] lg:h-[190px] text-white font-medium text-[15px] lg:text-[17px]" style={{ background: TONE_BG[t.tone] }}>
                      <Backdrop src={t.image} overlay={`linear-gradient(180deg, ${TONE_BG[t.tone]}66 0%, ${TONE_BG[t.tone]}E6 100%)`} />
                      <span className="relative">{t.label}</span>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* The challenge */}
      <Section>
        <Reveal className="panel bg-white border border-silver grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <EyebrowDraw>{h.challenge.eyebrow}</EyebrowDraw>
            <Lines as="h2" className="t-h1 text-g1 mt-6 mb-7">{h.challenge.title}</Lines>
            <p className="t-body text-gm m-0">{h.challenge.body}</p>
            <div className="w-[88px] h-[2px] bg-g3 mt-10" />
          </div>
          <div>
            <Hairline />
            {h.challenge.items.map((it) => (
              <div key={it.title}>
                <div className="flex gap-5 py-7">
                  <Icon name={it.icon} size={28} className="text-g3 shrink-0" />
                  <div>
                    <h4 className="font-sans font-medium text-[19px] lg:text-[22px] text-g1 m-0" style={{ lineHeight: 1.25 }}>{it.title}</h4>
                    <p className="t-body text-gm mt-2.5 mb-0">{it.body}</p>
                  </div>
                </div>
                <Hairline />
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Traditional vs KWE */}
      <Section>
        <Lines as="h2" className="t-h2 text-g1 mt-0 mb-10">{h.comparison.title}</Lines>
        <Reveal className="grid lg:grid-cols-2 rounded-[24px] overflow-hidden border border-silver">
          {[{ label: h.comparison.traditionalLabel, key: "traditional" as const, dark: false, image: h.comparison.traditionalImage }, { label: h.comparison.kweLabel, key: "kwe" as const, dark: true, image: h.comparison.kweImage }].map((col) => (
            <div key={col.key} className={`relative overflow-hidden p-6 md:p-8 lg:p-12 ${col.dark ? "bg-g1 text-white" : "bg-sage text-gm"}`}>
              <Backdrop src={col.image} overlay={col.dark ? "linear-gradient(180deg, rgba(6,27,32,.82), rgba(6,27,32,.94))" : "linear-gradient(180deg, rgba(220,229,230,.9), rgba(220,229,230,.96))"} />
              <div className="relative">
              <Eyebrow dark={col.dark} dot={col.dark ? "g3" : "none"} className="mb-9">{col.label}</Eyebrow>
              <ul className="list-none p-0 m-0 space-y-6">
                {h.comparison.rows.map((r) => (
                  <li key={r.label} className="flex gap-4 items-start text-[17px] lg:text-[20px]" style={{ lineHeight: 1.4 }}>
                    <span className={`shrink-0 mt-1 ${col.dark ? "text-g5" : "text-gl"}`}>{col.dark ? <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8.5l3 3 7-7" /></svg> : <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h12" /></svg>}</span>
                    <span><span className={`block text-[12px] font-medium uppercase tracking-[0.08em] mb-1 ${col.dark ? "text-g5" : "text-g3"}`}>{r.label}</span>{r[col.key]}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* What we do */}
      <Section>
        <Reveal className="panel bg-off grid lg:grid-cols-[5fr_11fr] gap-10 lg:gap-16">
          <div>
            <EyebrowDraw>{h.whatWeDo.eyebrow}</EyebrowDraw>
            <Lines as="h2" className="t-h2 text-g1 mt-6 mb-6">{h.whatWeDo.title}</Lines>
            <p className="t-body text-gm m-0">{h.whatWeDo.body}</p>
            <div className="w-14 h-[2px] bg-g3 mt-8" />
          </div>
          <div className="flex flex-col gap-4">
            {h.whatWeDo.cards.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.1}>
                <Link to={c.to} className="card-hover relative overflow-hidden block rounded-2xl bg-g1 p-8 no-underline group">
                  <Backdrop src={c.image} overlay="linear-gradient(100deg, rgba(6,27,32,.95) 30%, rgba(6,27,32,.7) 100%)" />
                  <div className="relative">
                  <div className="flex items-center justify-between"><span className="serif text-g5 text-[22px]">{c.n}</span><Icon name="ne" size={18} className="text-g5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
                  <h3 className="font-sans font-medium text-white text-[19px] lg:text-[22px] mt-4 mb-1">{c.title}</h3>
                  <p className="text-g5 text-[15px] m-0">{c.subtitle}</p>
                  <p className="text-g6 text-[16px] mt-4 mb-0" style={{ lineHeight: 1.55 }}>{c.body}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Case studies slider */}
      <Section>
        <Reveal className="flex items-end justify-between gap-6 mb-12">
          <div><EyebrowDraw>{h.caseStudies.eyebrow}</EyebrowDraw><Lines as="h2" className="t-h2 text-g1 mt-6 mb-0">{h.caseStudies.title}</Lines></div>
        </Reveal>
        <CaseSlider />
      </Section>

      {/* Team — vertical people columns on desktop (cinven .js-people), horizontal strip on mobile */}
      <Section>
        <FadeUp className="flex items-end justify-between gap-6 mb-12">
          <div><EyebrowDraw>{h.team.eyebrow}</EyebrowDraw><Lines as="h2" className="t-h2 text-g1 mt-6 mb-0 max-w-[900px]">{h.team.title}</Lines><p className="t-lead text-gm mt-5 mb-0 max-w-[760px]">{h.team.subtitle}</p></div>
          <div className="hidden md:block"><TextLink to={h.team.link.to}>{h.team.link.label}</TextLink></div>
        </FadeUp>
        <PeopleColumns />
      </Section>

      {/* Testimonials + Trusted by */}
      <Section bg="#FAFAFA" className="text-center">
        <FadeUp><EyebrowDraw>{h.testimonials.eyebrow}</EyebrowDraw></FadeUp><Lines as="h2" className="t-h2 text-g1 mt-5 mb-14">{h.testimonials.title}</Lines>
        <HorizontalScroll className="text-left">
          {h.testimonials.items.map((t) => (
            <div key={t.name} className="relative overflow-hidden shrink-0 w-full md:w-[48%] lg:w-[420px] rounded-[20px] p-5 flex flex-col justify-between min-h-[520px] lg:min-h-[560px]" style={{ background: GRAD[t.tone] }}>
              <Backdrop src={t.image} overlay="linear-gradient(180deg, rgba(6,27,32,.65) 0%, rgba(6,27,32,.25) 45%, rgba(6,27,32,.7) 100%)" />
              <span className="relative text-white font-bold text-[20px]">{t.firm}</span>
              <div className="relative rounded-xl p-5" style={{ background: "rgba(255,255,255,.72)", backdropFilter: "blur(10px)" }}>
                <p className="text-g1 text-[15px] m-0" style={{ lineHeight: 1.5 }}>“{t.quote}”</p>
                <div className="text-g1 font-medium text-[22px] mt-5" style={{ lineHeight: 1.1 }}>{t.name}</div>
                <div className="text-gm text-[13px] mt-2" style={{ lineHeight: 1.4 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </HorizontalScroll>
        <FadeUp className="mt-20"><EyebrowDraw>{h.testimonials.trustedEyebrow}</EyebrowDraw></FadeUp><Lines as="h2" className="t-h2 text-g1 mt-5 mb-12">{h.testimonials.trustedTitle}</Lines>
        <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {h.testimonials.logos.map((l) => (
            <div key={l.name} className="rounded-[20px] bg-white h-[110px] lg:h-[140px] flex items-center justify-center gap-3 px-4 text-g1">
              <span className="w-11 h-11 rounded-xl bg-g1 text-white inline-flex items-center justify-center shrink-0"><Icon name={l.icon} size={22} /></span>
              <span className="font-semibold text-[17px] lg:text-[20px] tracking-[-0.01em]">{l.name}</span>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* Insights */}
      <Section>
        <Reveal className="lg:w-[41%]"><div className="text-[14px] font-medium uppercase tracking-[0.02em] text-g1 pb-2.5 border-b border-g1">{h.insights.label}</div></Reveal>
        <Reveal delay={0.1} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-10 mb-14">
          <Lines as="h2" className="t-display text-g1 m-0 max-w-[760px]">{h.insights.title}</Lines>
          <Button to={h.insights.button.to}>{h.insights.button.label}</Button>
        </Reveal>
        <div className={`grid md:grid-cols-2 ${INSIGHT_COLS[Math.min(data.insights.items.length, 4)]} gap-x-6 gap-y-10`}>
          {data.insights.items.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <NewsCard to={`/insight/${a.slug}`} image={a.image} title={a.title} ratio={data.insights.items.length > 2 ? 1 : 0.62} big={data.insights.items.length <= 2} readMore={h.insights.readMore} tags={[{ label: a.category, dot: "#9CB5B9" }, ...(a.date ? [{ label: a.date, dot: "#FFFFFF" }] : [])]} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

function PeopleColumns() {
  const data = useContent();
  const m = data.team.members;
  const cols = [0, 1, 2].map((c) => m.filter((_, k) => k % 3 === c));
  const card = (p: typeof m[number], k: string) => (
    <Link key={k} to={`/team/${p.slug}`} className="card-hover block w-[240px] md:w-[280px] lg:w-full mr-6 lg:mr-0 lg:mb-6 no-underline">
      <div className="img-zoom rounded-lg grad-dark" style={{ aspectRatio: "0.75" }}>{p.image && <img src={p.image} alt={p.name} loading="lazy" style={{ filter: "grayscale(1) contrast(1.05)" }} />}</div>
      <div className="card-title text-g1 text-[19px] mt-4 font-medium">{p.name}</div>
      <div className="text-gm text-[15px] mt-1">{p.role}</div>
      <div className="text-g3 text-[14px] mt-1.5">{p.credential}</div>
    </Link>
  );
  return (
    <>
      <div className="lg:hidden"><Marquee duration={34} items={m.map((p) => card(p, p.slug))} /></div>
      <div className="hidden lg:grid grid-cols-3 gap-6 h-[720px] overflow-hidden relative people-cols">
        {cols.map((col, ci) => (
          <div key={ci} className="people-col" style={{ animationDuration: `${26 + ci * 6}s`, animationDelay: `${-ci * 7}s` }}>
            {[...col, ...col].map((p, k) => card(p, `${ci}-${k}`))}
          </div>
        ))}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>
    </>
  );
}

function CaseSlider() {
  const data = useContent();
  const h = data.home;
  const cases = data.caseStudies.items;
  const [i, setI] = useState(0);
  const c = cases[i];
  return (
    <div>
      <div className="flex justify-end gap-2 mb-6">
        <span className="self-center text-g1 text-[15px] mr-2">{String(i + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}</span>
        <button aria-label="Previous" onClick={() => setI((i - 1 + cases.length) % cases.length)} className="w-12 h-12 rounded-full border border-silver text-g1 inline-flex items-center justify-center hover:bg-g1 hover:text-white hover:border-g1 transition-colors"><ArrowRight rotate={180} /></button>
        <button aria-label="Next" onClick={() => setI((i + 1) % cases.length)} className="w-12 h-12 rounded-full bg-g1 text-white inline-flex items-center justify-center hover:bg-g3 transition-colors"><ArrowRight /></button>
      </div>
      <motion.div key={c.slug} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }} className="grid lg:grid-cols-[10fr_6fr] gap-6 lg:gap-6">
        <div className="relative">
          <Parallax className="img-zoom rounded-xl h-[320px] md:h-[420px] lg:h-[600px]"><img src={c.image} alt="" /></Parallax>
          <Badges tags={caseBadges(c)} className="absolute left-4 top-4 lg:left-5 lg:top-5" />
        </div>
        <div className="rounded-xl bg-off p-7 lg:p-10 flex flex-col justify-between min-h-[320px]">
          <div>
            <Eyebrow>{c.category}</Eyebrow>
            <h3 className="t-h3 text-g1 mt-5 mb-4">{c.title}</h3>
            <p className="t-body text-gm m-0">{c.subtitle}</p>
          </div>
          <div className="mt-8"><TextLink to={`/case-study/${c.slug}`}>{h.caseStudies.link.label}</TextLink></div>
        </div>
      </motion.div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {cases.map((_, k) => (<button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-[2px] rounded-full transition-colors ${k === i ? "bg-g1" : "bg-silver"}`} />))}
      </div>
    </div>
  );
}
