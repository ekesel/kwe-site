import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import data from "@/data";
import { ArrowRight, Button, Eyebrow, GRAD, Hairline, Icon, Reveal, TONE_BG, TONE_FG, TextLink } from "@/components/ui";
import { CTABand, Marquee, NewsCard, Section, VideoHero } from "@/components/sections";
import { EyebrowDraw, FadeUp, HorizontalScroll, Lines, Parallax, PinnedStack } from "@/motion";

const h = data.home;

export default function HomePage() {
  return (
    <>
      <VideoHero title={h.hero.title} scrollCue={h.hero.scrollCue} cueTarget="#content" />

      {/* Introduction */}
      <Section id="content">
        <div className="grid lg:grid-cols-16 gap-6">
          <FadeUp className="lg:col-span-4"><EyebrowDraw>{h.intro.eyebrow}</EyebrowDraw></FadeUp>
          <div className="lg:col-span-11 lg:col-start-6">
            <Lines as="p" className="t-h2 text-g1 m-0" stagger={0.08}>{h.intro.statement}</Lines>
            <FadeUp delay={0.3} className="mt-8"><TextLink to={h.intro.link.to}>{h.intro.link.label}</TextLink></FadeUp>
          </div>
        </div>
      </Section>

      {/* By the numbers */}
      <Section bg="#FAFAFA">
        <FadeUp><EyebrowDraw>{h.stats.eyebrow}</EyebrowDraw></FadeUp>
        <Lines as="h2" className="t-h2 text-g1 mt-6 mb-12 max-w-[820px]">{h.stats.title}</Lines>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {h.stats.items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} y={100} className="rounded-[20px] p-7 lg:p-10 flex flex-col justify-between aspect-[4/5] lg:aspect-auto lg:h-[360px]" style={{ background: TONE_BG[s.tone], color: TONE_FG[s.tone] }}>
              <span className="serif text-[48px] md:text-[64px] lg:text-[88px] leading-none" style={{ letterSpacing: "-0.02em" }}>{s.figure}</span>
              <span className="font-medium text-[16px] lg:text-[18px] leading-snug">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Who we work with */}
      <Section>
        <Reveal className="panel bg-off">
          <EyebrowDraw dot="berry">{h.who.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h2 text-g1 mt-6 mb-12 max-w-[900px]">{h.who.title}</Lines>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {h.who.tiles.map((t, i) => (
              <Reveal key={t.label} delay={i * 0.08} className="rounded-xl p-5 flex items-end h-[150px] lg:h-[190px] text-white font-medium text-[15px] lg:text-[17px]" style={{ background: TONE_BG[t.tone] }}>{t.label}</Reveal>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* The challenge */}
      <Section>
        <Reveal className="panel bg-white border border-silver grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <EyebrowDraw dot="berry">{h.challenge.eyebrow}</EyebrowDraw>
            <Lines as="h2" className="t-h1 text-g1 mt-6 mb-7">{h.challenge.title}</Lines>
            <p className="t-body text-gm m-0">{h.challenge.body}</p>
            <div className="w-[88px] h-[2px] bg-berry mt-10" />
          </div>
          <div>
            <Hairline />
            {h.challenge.items.map((it) => (
              <div key={it.title}>
                <div className="flex gap-5 py-7">
                  <Icon name={it.icon} size={28} className="text-berry shrink-0" />
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
        <Reveal className="grid lg:grid-cols-2 rounded-[24px] overflow-hidden border border-silver">
          {[{ ...h.diptych.traditional, dark: false, icon: "minus" }, { ...h.diptych.kwe, dark: true, icon: "check" }].map((col) => (
            <div key={col.label} className={`p-6 md:p-8 lg:p-12 ${col.dark ? "bg-g1 text-white" : "bg-sage text-gm"}`}>
              <Eyebrow dark={col.dark} dot={col.dark ? "berry" : "none"} className="mb-9">{col.label}</Eyebrow>
              <ul className="list-none p-0 m-0 space-y-6">
                {col.items.map((t) => (
                  <li key={t} className="flex gap-4 items-start text-[17px] lg:text-[20px]" style={{ lineHeight: 1.4 }}>
                    <span className={`shrink-0 mt-1 ${col.dark ? "text-g5" : "text-gl"}`}>{col.dark ? <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8.5l3 3 7-7" /></svg> : <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h12" /></svg>}</span>
                    {t}
                  </li>
                ))}
              </ul>
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
            <div className="w-14 h-[2px] bg-berry mt-8" />
          </div>
          <div className="flex flex-col gap-4">
            {h.whatWeDo.cards.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.1}>
                <Link to={c.to} className="block rounded-2xl bg-g1 p-8 no-underline group transition-colors hover:bg-g2">
                  <div className="flex items-center justify-between"><span className="serif text-g5 text-[22px]">{c.n}</span><Icon name="ne" size={18} className="text-g5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
                  <h3 className="font-sans font-medium text-white text-[19px] lg:text-[22px] mt-4 mb-1">{c.title}</h3>
                  <p className="text-g5 text-[15px] m-0">{c.subtitle}</p>
                  <p className="text-g6 text-[16px] mt-4 mb-0" style={{ lineHeight: 1.55 }}>{c.body}</p>
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

      {/* Our approach — pinned stacking cards (cinven .js-pinned-cards) */}
      <Section>
        <FadeUp><EyebrowDraw dot="berry">{h.approach.eyebrow}</EyebrowDraw></FadeUp>
        <Lines as="h2" className="t-h2 text-g1 mt-6 mb-14 max-w-[900px]">{h.approach.title}</Lines>
        <PinnedStack>
          {h.approach.steps.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={s.n} className={`w-full grid lg:grid-cols-2 gap-5 lg:gap-10 items-center rounded-[24px] bg-white lg:p-10 lg:border lg:border-silver ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="rounded-2xl h-[180px] md:h-[200px] lg:h-[360px]" style={{ background: GRAD[s.tone] }} />
                <div className={flip ? "lg:text-right" : ""}>
                  <div className="serif text-berry text-[32px] lg:text-[44px] leading-none">{s.n}</div>
                  <h3 className="font-sans font-medium text-g1 text-[21px] lg:text-[26px] mt-2.5 mb-2.5" style={{ lineHeight: 1.2 }}>{s.title}</h3>
                  <p className="t-body text-gm m-0">{s.body}</p>
                </div>
              </div>
            );
          })}
        </PinnedStack>
        <FadeUp className="mt-12"><Button to={h.approach.link.to} variant="secondary">{h.approach.link.label}</Button></FadeUp>
      </Section>

      {/* Team — vertical people columns on desktop (cinven .js-people), horizontal strip on mobile */}
      <Section>
        <FadeUp className="flex items-end justify-between gap-6 mb-12">
          <div><EyebrowDraw>{h.team.eyebrow}</EyebrowDraw><Lines as="h2" className="t-h2 text-g1 mt-6 mb-0">{h.team.title}</Lines></div>
          <div className="hidden md:block"><TextLink to={h.team.link.to}>{h.team.link.label}</TextLink></div>
        </FadeUp>
        <PeopleColumns />
      </Section>

      {/* Testimonials + Trusted by */}
      <Section bg="#FAFAFA" className="text-center">
        <FadeUp><EyebrowDraw>{h.testimonials.eyebrow}</EyebrowDraw></FadeUp><Lines as="h2" className="t-h2 text-g1 mt-5 mb-14">{h.testimonials.title}</Lines>
        <HorizontalScroll className="text-left">
          {h.testimonials.items.map((t) => (
            <div key={t.name} className="shrink-0 w-full md:w-[48%] lg:w-[420px] rounded-[20px] p-5 flex flex-col justify-between min-h-[520px] lg:min-h-[560px]" style={{ background: GRAD[t.tone] }}>
              <span className="text-white font-bold text-[20px]">{t.firm}</span>
              <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,.55)", backdropFilter: "blur(10px)" }}>
                <p className="text-g1 text-[15px] m-0" style={{ lineHeight: 1.5 }}>“{t.quote}”</p>
                <div className="text-g1 font-medium text-[22px] mt-5" style={{ lineHeight: 1.1 }}>{t.name}</div>
                <div className="text-gm text-[13px] mt-2" style={{ lineHeight: 1.4 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </HorizontalScroll>
        <FadeUp className="mt-20"><EyebrowDraw>{h.testimonials.trustedEyebrow}</EyebrowDraw></FadeUp><Lines as="h2" className="t-h2 text-g1 mt-5 mb-12">{h.testimonials.trustedTitle}</Lines>
        <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {h.testimonials.logos.map((l) => (<div key={l} className="rounded-[20px] bg-white h-[110px] lg:h-[140px] flex items-center justify-center font-bold text-[18px] lg:text-[22px] text-ink">{l}</div>))}
        </Reveal>
      </Section>

      {/* Insights */}
      <Section>
        <Reveal className="lg:w-[41%]"><div className="text-[14px] font-medium uppercase tracking-[0.02em] text-g1 pb-2.5 border-b border-g1">{h.insights.label}</div></Reveal>
        <Reveal delay={0.1} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-10 mb-14">
          <Lines as="h2" className="t-display text-g1 m-0 max-w-[760px]">{h.insights.title}</Lines>
          <Button to={h.insights.button.to}>{h.insights.button.label}</Button>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {[...data.insights.items, { slug: "", category: data.insights.extraCards[0].category, date: "September 2024", title: data.insights.extraCards[0].title, image: data.insights.extraCards[0].image }].map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <NewsCard to={a.slug ? `/insight/${a.slug}` : "/insights"} image={a.image} title={a.title} ratio={1} readMore={h.insights.readMore} tags={[{ label: a.category, dot: "#9CB5B9" }, { label: a.date, dot: "#824270" }]} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}

function PeopleColumns() {
  const m = data.team.members;
  const cols = [[m[0], m[3], m[1]], [m[1], m[2], m[0]], [m[2], m[0], m[3]]];
  const card = (p: typeof m[number], k: string) => (
    <Link key={k} to={`/team/${p.slug}`} className="card-hover block w-[240px] md:w-[280px] lg:w-full mr-6 lg:mr-0 lg:mb-6 no-underline">
      <div className="img-zoom rounded-lg" style={{ aspectRatio: "0.75" }}><img src={p.image} alt={p.name} loading="lazy" style={{ filter: "grayscale(1) contrast(1.05)" }} /></div>
      <div className="card-title text-g1 text-[19px] mt-4 font-medium">{p.name}</div>
      <div className="text-gm text-[15px] mt-1">{p.role}</div>
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
        <Parallax className="img-zoom rounded-xl h-[320px] md:h-[420px] lg:h-[600px]"><img src={c.image} alt="" /></Parallax>
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
