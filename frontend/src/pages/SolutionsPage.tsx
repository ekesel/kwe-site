import { useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { ArrowRight, Hairline, TextLink, usePageTitle } from "@/components/ui";
import { Section, VideoHero } from "@/components/sections";
import { EyebrowDraw, FadeUp, Lines, Parallax } from "@/motion";

export default function SolutionsPage() {
  const data = useContent();
  const s = data.solutions;
  usePageTitle(s.hero.eyebrow);
  const [hover, setHover] = useState(1);
  return (
    <>
      <VideoHero title={s.hero.title} subtitle={s.hero.subtitle} />

      {/* Why KWE Advisors */}
      <Section id="content">
        <div className="grid lg:grid-cols-16 gap-6">
          <FadeUp className="lg:col-span-4"><EyebrowDraw>{s.hero.eyebrow}</EyebrowDraw></FadeUp>
          <div className="lg:col-span-11 lg:col-start-6">
            <Lines as="h2" className="t-h2 text-g1 m-0" stagger={0.08}>{s.whyKwe.title}</Lines>
            <FadeUp delay={0.2}><p className="t-lead text-gm mt-7 mb-0 max-w-[820px]">{s.whyKwe.body}</p></FadeUp>
          </div>
        </div>
      </Section>

      {/* Capability list — dark, with hover-reveal image (cinven sectors) */}
      <section className="bg-g1 text-white container-x section">
        <div className="max-w-[1312px] mx-auto grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-start">
          <FadeUp>
            <div className="border-t border-white/10">
              {s.items.map((it, i) => (
                <Link key={it.slug} to={`/solution/${it.slug}`} onMouseEnter={() => setHover(i)} className={`sol-row block no-underline border-b border-white/10 py-7 lg:py-9 transition-opacity duration-200 ${hover !== i ? "lg:opacity-60" : "opacity-100"}`} style={{ transitionTimingFunction: "cubic-bezier(.65,0,.35,1)" }}>
                  <div className="grid grid-cols-[40px_64px_1fr_56px] lg:grid-cols-[48px_88px_1fr_260px_56px] gap-4 lg:gap-6 items-center">
                    <span className="text-g5 text-[14px]">{it.n}</span>
                    <span className="block rounded-lg overflow-hidden h-12 lg:h-16"><img src={it.image} alt="" loading="lazy" className="w-full h-full object-cover" style={{ filter: "grayscale(1)" }} /></span>
                    <span className="sol-title serif text-white text-[26px] md:text-[30px] lg:text-[36px]" style={{ lineHeight: 1.1 }}>{it.title}</span>
                    <span className="hidden lg:block text-g5 text-[15px]" style={{ lineHeight: 1.45 }}>{it.tagline}</span>
                    <span className="sol-icon w-14 h-14 rounded-full border border-white/40 text-white inline-flex items-center justify-center"><ArrowRight size={18} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeUp>
          <div className="hidden lg:block relative rounded-2xl overflow-hidden h-[460px] sticky top-32">
            {s.items.map((it, i) => (
              <img key={it.slug} src={it.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-all" style={{ opacity: hover === i ? 1 : 0, transform: hover === i ? "translateY(0) scale(1)" : "translateY(-6%) scale(1.04)", filter: "grayscale(1)", transitionDuration: hover === i ? ".6s, .5s" : ".16s, .8s", transitionProperty: "opacity, transform", transitionTimingFunction: "cubic-bezier(.33,1,.68,1), cubic-bezier(.45,0,.55,1)" }} />
            ))}
          </div>
        </div>
      </section>

      {/* In detail — three cells with images */}
      <Section>
        <FadeUp><EyebrowDraw>{s.detailEyebrow}</EyebrowDraw></FadeUp>
        <Lines as="h2" className="t-h2 text-g1 mt-6 mb-12">{s.detailTitle}</Lines>
        <div className="grid md:grid-cols-3 gap-6">
          {s.items.map((it, i) => (
            <FadeUp key={it.slug} delay={i * 0.1} y={100}>
              <Link to={`/solution/${it.slug}`} className="card-hover block no-underline h-full">
                <Parallax className="img-zoom rounded-xl" style={{ aspectRatio: "1 / 1.05" }}><img src={it.image} alt="" loading="lazy" style={{ filter: "grayscale(1)" }} /></Parallax>
                <div className="eyebrow mt-7"><span className="dot" />{it.tag}</div>
                <h3 className="card-title t-h3 text-g1 mt-4 mb-3">{it.title}</h3>
                <p className="t-body text-gm m-0">{it.tagline}</p>
                <ul className="list-none p-0 mt-5 mb-6 space-y-2">
                  {it.highlights.map((b) => (<li key={b} className="flex gap-3 text-[15px] text-gm"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-g3 shrink-0" />{b}</li>))}
                </ul>
                <TextLink to={`/solution/${it.slug}`}>{s.exploreLabel}</TextLink>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* At a glance */}
      <Section>
        <FadeUp className="panel bg-off">
          <EyebrowDraw>{s.glance.eyebrow}</EyebrowDraw>
          <Lines as="h2" className="t-h2 text-g1 mt-6 mb-10">{s.glance.title}</Lines>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[12px] font-medium uppercase tracking-[0.08em] text-gm pb-4 pr-4">{s.glance.challengeHeader}</th>
                  {s.glance.columns.map((c, i) => (<th key={c} className="text-left text-[12px] font-medium uppercase tracking-[0.08em] text-g1 pb-4 pr-4"><Link to={`/solution/${s.items[i].slug}`} className="text-g1 no-underline hover:text-berry transition-colors">{c}</Link></th>))}
                </tr>
                <tr><td colSpan={4}><Hairline color="#061B20" /></td></tr>
              </thead>
              <tbody>
                {s.glance.rows.map((r) => (
                  <tr key={r.label} className="border-b border-silver">
                    <td className="text-[15px] text-g1 py-5 pr-4">{r.label}</td>
                    {r.cells.map((c, k) => (<td key={k} className="py-5 pr-4">{c ? <span className="w-5 h-5 rounded-full bg-g1 inline-flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-white" /></span> : <span className="w-5 h-5 rounded-full border border-silver inline-block" />}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
