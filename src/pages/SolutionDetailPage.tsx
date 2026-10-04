import { Link, useParams } from "react-router-dom";
import data from "@/data";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { ArrowRight, Eyebrow, Icon, Reveal } from "@/components/ui";
import { CTABand, Carousel, Section, VideoHero } from "@/components/sections";
import NotFoundPage from "./NotFoundPage";

const s = data.solutions;

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const it = s.items.find((x) => x.slug === slug);
  if (!it) return <NotFoundPage />;
  const others = s.items.filter((x) => x.slug !== slug);
  return (
    <>
      <VideoHero eyebrow={s.hero.eyebrow} title={it.title} subtitle={[it.subtitle, it.lead]} align="left" height="88svh" scrollCue={s.scrollCue} cueTarget="#content" />

      {/* Overview — divided split */}
      <Section id="content">
        <Reveal className="panel bg-off grid lg:grid-cols-[4fr_1px_11fr] gap-6 lg:gap-16 lg:py-24">
          <div><EyebrowDraw dot="berry" line={false}>{s.overviewEyebrow}</EyebrowDraw></div>
          <div className="hidden lg:block bg-silver" />
          <p className="serif text-g1 text-[28px] md:text-[36px] lg:text-[52px] m-0" style={{ lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            {it.overview.before}<span className="text-g3">{it.overview.highlight}</span>{it.overview.after}
          </p>
        </Reveal>
      </Section>

      {/* What we deliver — icon cards */}
      <Section>
        <Reveal className="panel bg-off">
          <EyebrowDraw dot="berry" line={false}>{s.deliverEyebrow}</EyebrowDraw>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            {it.deliverables.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08} className="rounded-2xl bg-white border border-silver p-7 lg:p-11">
                <div className="w-[76px] h-[76px] rounded-2xl bg-[#EDF0F0] text-g3 inline-flex items-center justify-center"><Icon name={d.icon} size={30} /></div>
                <h3 className="font-sans font-medium text-g1 text-[21px] lg:text-[26px] mt-10 mb-0" style={{ lineHeight: 1.25 }}>{d.title}</h3>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* What you can expect — rich cards, deep green */}
      <Section>
        <Reveal className="panel grad-dark text-white">
          <EyebrowDraw dark dot="berry" line={false}>{s.expectEyebrow}</EyebrowDraw>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {it.expect.map((e, i) => {
              const last = i === it.expect.length - 1;
              return (
                <Reveal key={e.title} delay={i * 0.08} className="rounded-2xl p-7 lg:p-10 border" style={{ background: "rgba(255,255,255,.04)", borderColor: last ? "#824270" : "rgba(255,255,255,.12)" }}>
                  <div className="w-16 h-16 rounded-[14px] inline-flex items-center justify-center" style={{ background: "rgba(255,255,255,.08)", color: last ? "#C48DB5" : "#9CB5B9" }}><Icon name={e.icon} size={26} /></div>
                  <h3 className="font-sans font-medium text-white text-[20px] lg:text-[24px] mt-8 mb-2.5" style={{ lineHeight: 1.25 }}>{e.title}</h3>
                  <p className="text-g5 text-[16px] lg:text-[18px] m-0" style={{ lineHeight: 1.5 }}>{e.body}</p>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </Section>

      {/* More solutions — soft tints carousel */}
      <Section>
        <Reveal className="panel bg-white border border-silver">
          <Carousel eyebrow={s.moreEyebrow} title={s.moreTitle}>
            {[...others, it].map((o) => (
              <Link key={o.slug} to={`/solution/${o.slug}`} className="flex flex-col justify-between rounded-[20px] p-7 lg:p-10 no-underline w-[82vw] md:w-[480px] lg:w-[560px] min-h-[300px] lg:min-h-[340px]" style={{ background: o.tint }}>
                <div>
                  <div className="text-[15px] uppercase tracking-[0.06em] text-g3">{o.category}</div>
                  <h3 className="font-sans font-medium text-g1 text-[24px] lg:text-[30px] mt-3.5 mb-3.5" style={{ lineHeight: 1.2 }}>{o.title}</h3>
                  <p className="text-gm text-[16px] lg:text-[19px] m-0" style={{ lineHeight: 1.5 }}>{o.cardBody}</p>
                </div>
                <span className="mt-8 w-[52px] h-[52px] rounded-full bg-g1 text-white inline-flex items-center justify-center"><ArrowRight size={18} rotate={-45} /></span>
              </Link>
            ))}
          </Carousel>
        </Reveal>
      </Section>

      <CTABand />
    </>
  );
}
