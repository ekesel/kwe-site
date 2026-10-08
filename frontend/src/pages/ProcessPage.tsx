import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { ArrowRight, Eyebrow, Hairline, Icon, Reveal } from "@/components/ui";
import { CTABand, Section, VideoHero } from "@/components/sections";

export default function ProcessPage() {
  const data = useContent();
  const p = data.process;
  return (
    <>
      <VideoHero eyebrow={p.hero.eyebrow} title={p.hero.title} subtitle={p.hero.subtitle} scrollCue={data.home.hero.scrollCue} cueTarget="#phases">
        {p.hero.anchors.map((a) => (<a key={a} href="#phases" className="pill-ghost">{a}</a>))}
      </VideoHero>

      {/* Phases — dark index rail */}
      <Section id="phases"><Reveal><Stepper /></Reveal></Section>

      {/* Why KWE */}
      <Section>
        <Reveal className="panel bg-off flex flex-col items-center lg:p-20">
          <EyebrowDraw dot="berry" line={false}>{p.why.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h2 text-g1 text-center mt-5 mb-14 max-w-[600px]">{p.why.title}</Lines>
          <div className="grid lg:grid-cols-2 gap-6 w-full max-w-[1000px]">
            {p.why.cards.map((c) => (
              <div key={c.title} className="rounded-2xl bg-white border border-silver p-7 lg:p-12">
                <div className="w-[72px] h-[72px] rounded-2xl inline-flex items-center justify-center" style={{ background: c.tone === "blush" ? "#EFE1EA" : "#E4E9EA", color: c.tone === "blush" ? "#824270" : "#4C6569" }}><Icon name={c.icon} size={30} /></div>
                <h3 className="font-sans font-medium text-g1 text-[21px] lg:text-[26px] mt-7 mb-4" style={{ lineHeight: 1.2 }}>{c.title}</h3>
                <p className="text-gm text-[16px] lg:text-[18px] m-0" style={{ lineHeight: 1.55 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Timeline strip */}
      <section className="bg-g1 text-white container-x py-14 lg:py-20">
        <Reveal className="max-w-[1312px] mx-auto grid lg:grid-cols-[1fr_2fr] gap-10 items-center">
          <div>
            <div className="serif text-[48px] lg:text-[64px] leading-none">{p.timeline.figure}</div>
            <p className="text-g5 text-[16px] lg:text-[17px] mt-4 mb-0 max-w-[360px]" style={{ lineHeight: 1.5 }}>{p.timeline.text}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {p.timeline.nodes.map((n, i) => (
              <div key={n} className="flex flex-col items-start lg:items-center lg:text-center">
                <div className="flex items-center w-full"><span className="w-9 h-9 rounded-full bg-g2 text-g5 text-[13px] inline-flex items-center justify-center shrink-0">{String(i + 1).padStart(2, "0")}</span><span className={`h-px flex-1 bg-g3 ${i === p.timeline.nodes.length - 1 ? "opacity-0" : ""} hidden lg:block`} /></div>
                <p className="text-g5 text-[14px] mt-3 mb-0 lg:pr-6" style={{ lineHeight: 1.4 }}>{n}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <Section>
        <Reveal><EyebrowDraw line={false}>{p.faq.eyebrow}</EyebrowDraw><Hairline className="mt-4" /></Reveal>
        <Reveal delay={0.1}><Lines as="h2" className="t-h2 text-g1 mt-12 mb-10">{p.faq.title}</Lines></Reveal>
        <Reveal className="max-w-[820px]"><FAQ /></Reveal>
      </Section>

      <CTABand />
    </>
  );
}

function Stepper() {
  const data = useContent();
  const p = data.process;
  const st = p.stepper;
  const [i, setI] = useState(0);
  const s = st.steps[i];
  const next = st.steps[(i + 1) % st.steps.length];
  return (
    <div className="grid lg:grid-cols-[5fr_11fr] rounded-[24px] overflow-hidden border border-silver bg-white">
      <div className="grad-dark text-white p-6 lg:p-10">
        <Eyebrow dark dot="berry" className="mb-6 lg:mb-10">{st.eyebrow}</Eyebrow>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {st.steps.map((x, k) => {
            const on = k === i;
            return (
              <button key={x.n} onClick={() => setI(k)} className={`text-left rounded-xl px-4 py-3 lg:px-7 lg:py-6 transition-colors duration-300 border ${on ? "bg-white/10 border-white/20" : "bg-transparent border-transparent hover:bg-white/5"}`}>
                <div className="serif text-[14px] lg:text-[18px]" style={{ color: on ? "#C48DB5" : "#9CB5B9" }}>{x.n}</div>
                <div className={`text-[15px] lg:text-[20px] mt-1 ${on ? "text-white font-medium" : "text-g5"}`}>{x.short}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-7 md:p-10 lg:p-16">
        <AnimatePresence mode="wait">
          <motion.div key={s.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.333, 0, 0, 1] }}>
            <Lines as="h2" className="t-h1 text-g1 m-0">{s.title}</Lines>
            <p className="font-medium text-g1 text-[19px] lg:text-[24px] mt-6 mb-0" style={{ lineHeight: 1.4 }}>{s.lead}</p>
            <p className="text-gm text-[16px] lg:text-[19px] mt-6 mb-0" style={{ lineHeight: 1.6 }}>{s.body}</p>
            <button onClick={() => setI((i + 1) % st.steps.length)} className="tlink berry-hover text-g1 text-[18px] mt-10 bg-transparent border-0 p-0 cursor-pointer">{st.nextLabel}: {next.short}<span className="text-berry"><ArrowRight size={16} /></span></button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FAQ() {
  const data = useContent();
  const p = data.process;
  const [open, setOpen] = useState<number | null>(4);
  return (
    <div>
      {p.faq.items.map((f, k) => {
        const on = open === k;
        return (
          <div key={f.q} className="border-b border-silver">
            <button onClick={() => setOpen(on ? null : k)} className="w-full flex items-center justify-between gap-6 py-6 text-left bg-transparent border-0 cursor-pointer" aria-expanded={on}>
              <span className="text-g1 text-[17px] lg:text-[19px] font-normal">{f.q}</span>
              <span className={`shrink-0 transition-colors duration-300 ${on ? "text-berry" : "text-g1"}`}><Icon name={on ? "minus" : "plus"} size={18} /></span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.333, 0, 0, 1] }} className="overflow-hidden">
                  <p className="text-gm text-[16px] mt-0 mb-6 max-w-[620px]" style={{ lineHeight: 1.6 }}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
