import { Link } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { Button, Eyebrow, Hairline, Reveal, TextLink, usePageTitle } from "@/components/ui";
import { Section, VideoHero } from "@/components/sections";

export default function StoryPage() {
  const data = useContent();
  const s = data.story;
  usePageTitle(s.hero.eyebrow);
  return (
    <>
      <VideoHero title={s.hero.title} subtitle={s.hero.subtitle} />

      {/* Who we are */}
      <Section id="content">
        <Reveal className="panel grad-dark text-white">
          <EyebrowDraw dark line={false}>{s.who.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h2 text-white mt-8 mb-16 max-w-[1000px]">{s.who.title}</Lines>
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {s.who.pillars.map((p) => (
                <div key={p.title}>
                  <Hairline color={p.accent ? "#FFFFFF" : "#4C6569"} />
                  <h4 className="font-sans font-medium text-white text-[20px] lg:text-[24px] mt-6 mb-3">{p.title}</h4>
                  <p className="text-g5 text-[17px] lg:text-[20px] m-0" style={{ lineHeight: 1.5 }}>{p.body}</p>
                </div>
              ))}
            </div>
            <div className="flex lg:flex-col gap-10 lg:gap-12 lg:text-right lg:border-l lg:border-white/15 lg:pl-16">
              {s.who.stats.map((st) => (<div key={st.label}><div className="serif text-white text-[40px] lg:text-[56px] leading-none">{st.figure}</div><div className="text-g5 text-[16px] mt-2">{st.label}</div></div>))}
            </div>
          </div>
          <div className="mt-12"><Button to={s.who.button.to} variant="ondark">{s.who.button.label}</Button></div>
        </Reveal>
      </Section>

      {/* Mission */}
      <section id="mission" className="bg-g1 container-x py-16 md:py-24 lg:py-40">
        <Reveal className="max-w-[1312px] mx-auto flex flex-col items-center">
          <Eyebrow dark dot="g3">{s.mission.eyebrow}</Eyebrow>
          <p className="serif text-white text-[24px] md:text-[30px] lg:text-[40px] mt-10 mb-0 max-w-[900px]" style={{ lineHeight: 1.25, letterSpacing: "-0.01em" }}>{s.mission.statement}</p>
        </Reveal>
      </section>

      {/* Background */}
      <Section id="background">
        <Reveal className="panel grad-dark text-white flex flex-col items-center">
          <EyebrowDraw dark line={false}>{s.background.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h2 text-white text-center mt-5 mb-12">{s.background.title}</Lines>
          <div className="w-full max-w-[900px]">
            <Hairline color="rgba(255,255,255,.15)" />
            {s.background.rows.map((r) => (
              <div key={r.n}>
                <div className="grid lg:grid-cols-[72px_160px_1fr] gap-3 lg:gap-10 py-7">
                  <div className="serif text-[28px] lg:text-[32px] leading-none" style={{ color: "#9CB5B9" }}>{r.n}</div>
                  <div className="font-medium text-[19px] lg:text-[20px] text-white" style={{ lineHeight: 1.2 }}>{r.label}</div>
                  <p className="text-[16px] m-0" style={{ lineHeight: 1.55, color: "#C5D4D7" }}>{r.body}</p>
                </div>
                <Hairline color="rgba(255,255,255,.15)" />
              </div>
            ))}
          </div>
          <div className="mt-10"><Button to={s.background.button.to} variant="ondark">{s.background.button.label}</Button></div>
        </Reveal>
      </Section>

      {/* How we respond */}
      <Section id="respond">
        <Reveal className="panel grad-dark text-white">
          <EyebrowDraw dark line={false}>{s.respond.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h1 text-white mt-7 mb-5 max-w-[760px]">{s.respond.title}</Lines>
          <p className="text-g5 text-[18px] lg:text-[22px] m-0">{s.respond.lead}</p>
          <div className="grid lg:grid-cols-4 gap-7 lg:gap-8 mt-14">
            {s.respond.steps.map((st, i) => (
              <div key={st.n}>
                <div className="flex items-center gap-4 lg:gap-8">
                  <span className={`w-11 h-11 rounded-full border-[1.5px] inline-flex items-center justify-center text-white font-medium shrink-0 ${i === 3 ? "border-white" : "border-g4"}`}>{st.n}</span>
                  <span className={`h-px flex-1 bg-g3 ${i === 3 ? "lg:opacity-0" : ""}`} />
                </div>
                <h4 className="font-sans font-medium text-white text-[20px] lg:text-[24px] mt-7 mb-2.5">{st.title}</h4>
                <p className="text-g5 text-[16px] lg:text-[20px] m-0" style={{ lineHeight: 1.5 }}>{st.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-16"><Button to={s.respond.button.to} variant="ondark">{s.respond.button.label}</Button></div>
        </Reveal>
      </Section>

      {/* Vision */}
      <Section id="vision">
        <Reveal className="panel bg-white border border-silver relative overflow-hidden lg:p-24">
          <div className="relative">
            <EyebrowDraw line={false}>{s.vision.eyebrow}</EyebrowDraw>
            <p className="serif text-g1 text-[32px] md:text-[44px] lg:text-[64px] mt-10 mb-0 max-w-[820px]" style={{ lineHeight: 1.12, letterSpacing: "-0.015em" }}>
              {s.vision.before}<span className="text-g3">{s.vision.highlight}</span>{s.vision.after}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Milestones */}
      <Section>
        <Reveal className="panel grad-dark text-white">
          <EyebrowDraw dark line={false}>{s.milestones.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h2 text-white mt-5 mb-14">{s.milestones.title}</Lines>
          <div className="hidden lg:flex items-center">
            {s.milestones.items.map((m) => (
              <div key={m.year} className="flex-1 flex items-center">
                <span className={`w-4 h-4 rounded-full shrink-0 ${m.current ? "bg-white" : "border-[1.5px] border-g5"}`} />
                <span className="h-px flex-1 bg-g3" />
              </div>
            ))}
          </div>
          <div className="lg:grid lg:grid-cols-5 lg:gap-6 lg:mt-5">
            {s.milestones.items.map((m, i) => (
              <div key={m.year} className="flex lg:block gap-5">
                <div className="lg:hidden flex flex-col items-center">
                  <span className={`w-4 h-4 rounded-full shrink-0 ${m.current ? "bg-white" : "border-[1.5px] border-g5"}`} />
                  {i < s.milestones.items.length - 1 && <span className="w-px flex-1 bg-g3" />}
                </div>
                <div className="pb-8 lg:pb-0">
                  <div className="serif text-white text-[28px] lg:text-[32px] leading-none">{m.year}</div>
                  <p className="text-[16px] mt-3 mb-0" style={{ lineHeight: 1.5, color: m.current ? "#FFFFFF" : "#C5D4D7" }}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Team teaser */}
      <Section>
        <Reveal className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-silver pt-10">
          <h3 className="t-h3 text-g1 m-0">{s.teamTeaser.title}</h3>
          <Link to={s.teamTeaser.link.to} className="shrink-0"><TextLink to={s.teamTeaser.link.to}>{s.teamTeaser.link.label}</TextLink></Link>
        </Reveal>
      </Section>
    </>
  );
}
