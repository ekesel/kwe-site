import { Link, useParams } from "react-router-dom";
import data from "@/data";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { ArrowRight, GRAD, Icon, Reveal } from "@/components/ui";
import { CTABand, DarkHero, PullQuote, Section } from "@/components/sections";
import NotFoundPage from "./NotFoundPage";

const n = data.insights;

export default function InsightDetailPage() {
  const { slug } = useParams();
  const a = n.items.find((x) => x.slug === slug);
  if (!a) return <NotFoundPage />;
  const t = n.article;
  const related = [...n.items.filter((x) => x.slug !== slug).map((x) => ({ category: x.category, title: x.title, image: x.image as string | null, to: `/insight/${x.slug}` })), { category: n.extraCards[2].category, title: n.extraCards[2].title, image: null, to: "/insights" }].slice(0, 3);
  return (
    <>
      <DarkHero>
        <div className="container-x pt-28 lg:pt-36 pb-10 lg:pb-16">
          <Reveal className="max-w-[1312px] mx-auto">
            <Link to="/insights" className="inline-flex items-center gap-2.5 text-g5 text-[17px] no-underline hover:text-white transition-colors"><ArrowRight rotate={180} size={16} />{t.back}</Link>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <span className="rounded-full bg-berry text-white text-[14px] font-medium uppercase tracking-[0.04em] px-5 py-2">{a.category}</span>
              <span className="text-g5 text-[16px]">{a.date}&nbsp;&nbsp;·&nbsp;&nbsp;{a.read}</span>
            </div>
            <h1 className="serif text-white text-[32px] md:text-[40px] lg:text-[56px] mt-8 mb-6 max-w-[900px]" style={{ lineHeight: 1.1, letterSpacing: "-0.015em" }}>{a.title}</h1>
            <p className="text-g6 text-[17px] lg:text-[20px] m-0 max-w-[820px]" style={{ lineHeight: 1.55 }}>{a.subtitle}</p>
            <div className="flex items-center gap-3.5 mt-10"><span className="w-10 h-10 rounded-full bg-g3 text-white text-[13px] font-medium inline-flex items-center justify-center">{t.initials}</span><span className="text-white text-[16px]">{t.author}</span></div>
          </Reveal>
        </div>
        <div className="relative h-[220px] md:h-[320px] lg:h-[420px]"><img src={a.image} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-g1/55" /></div>
      </DarkHero>

      <Section>
        <div className="grid lg:grid-cols-[4fr_9fr] gap-10 lg:gap-16 items-start">
          <Reveal className="lg:sticky lg:top-32">
            <div className="text-[13px] uppercase tracking-[0.08em] text-g3 font-medium">{t.toc}</div>
            <ul className="list-none p-0 m-0 mt-5 border-l border-silver">
              {a.toc.map((x, i) => (<li key={x} className={`pl-4 py-2 text-[15px] ${i === 0 ? "text-g1 font-medium border-l-2 border-berry -ml-px" : "text-gm"}`} style={{ lineHeight: 1.4 }}>{x}</li>))}
            </ul>
            <div className="flex gap-2 mt-7">
              <a href={data.site.linkedin} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="w-9 h-9 rounded-full border border-silver text-g1 inline-flex items-center justify-center hover:bg-g1 hover:text-white transition-colors"><Icon name="linkedin" size={14} /></a>
              <button aria-label="Copy link" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="w-9 h-9 rounded-full border border-silver text-g1 inline-flex items-center justify-center bg-transparent cursor-pointer hover:bg-g1 hover:text-white transition-colors"><Icon name="share" size={14} /></button>
            </div>
          </Reveal>
          <Reveal className="max-w-[760px]">
            <h2 className="serif text-g1 text-[26px] lg:text-[34px] m-0" style={{ lineHeight: 1.25 }}>{a.h2}</h2>
            <p className="text-g1 text-[17px] lg:text-[19px] mt-7 mb-0" style={{ lineHeight: 1.65 }}>{a.p1}</p>
            <div className="grid grid-cols-3 gap-3 mt-8">
              {a.stats.map((s) => (<div key={s.label} className="rounded-xl bg-off p-4 lg:p-5"><div className="flex items-baseline gap-0.5"><span className="serif text-g1 text-[24px] lg:text-[30px] leading-none">{s.big}</span>{s.unit && <span className="serif text-berry text-[14px] lg:text-[16px]">{s.unit}</span>}</div><div className="text-gm text-[12px] lg:text-[13px] mt-2.5" style={{ lineHeight: 1.4 }}>{s.label}</div></div>))}
            </div>
            <p className="text-g1 text-[17px] lg:text-[19px] mt-8 mb-0" style={{ lineHeight: 1.65 }}>{a.p2}</p>
            <div className="mt-8"><PullQuote text={a.quote} size="md" /></div>
            <p className="text-g1 text-[17px] lg:text-[19px] mt-8 mb-0" style={{ lineHeight: 1.65 }}>{a.p3}</p>
          </Reveal>
        </div>
      </Section>

      <Section bg="#FAFAFA">
        <Reveal><div className="text-[14px] font-medium uppercase tracking-[0.08em] text-g1">{t.related}</div></Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {related.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <Link to={r.to} className="card-hover block rounded-xl overflow-hidden bg-white border border-silver no-underline h-full">
                <div className="img-zoom" style={{ aspectRatio: "2.2", background: GRAD.aub }}>{r.image && <img src={r.image} alt="" loading="lazy" />}</div>
                <div className="p-5 pb-6"><div className="text-[12px] uppercase tracking-[0.08em] text-berry">{r.category}</div><h3 className="card-title font-sans font-medium text-g1 text-[17px] mt-2.5 mb-0" style={{ lineHeight: 1.35 }}>{r.title}</h3></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}
