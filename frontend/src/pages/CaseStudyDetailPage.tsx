import { Link, useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { ArrowRight, Eyebrow, GRAD, Hairline, Reveal } from "@/components/ui";
import { CTABand, Carousel, DarkHero, PullQuote, Section, StatTile } from "@/components/sections";
import NotFoundPage from "./NotFoundPage";

export default function CaseStudyDetailPage() {
  const data = useContent();
  const c = data.caseStudies;
  const { slug } = useParams();
  const cs = c.items.find((x) => x.slug === slug);
  if (!cs) return <NotFoundPage />;
  const d = c.detail;
  const others = [...c.items.filter((x) => x.slug !== slug).map((x) => ({ category: x.category, title: x.cardTitle, image: x.image, to: `/case-study/${x.slug}` })), ...c.extraCards.map((e) => ({ category: e.category, title: e.title, image: null as string | null, to: "/case-studies" }))];
  return (
    <>
      <DarkHero>
        <div className="container-x pt-28 lg:pt-36">
          <Reveal className="max-w-[1312px] mx-auto">
            <Link to="/case-studies" className="inline-flex items-center gap-2.5 text-g5 text-[17px] no-underline hover:text-white transition-colors"><ArrowRight rotate={180} size={16} />{d.back}</Link>
            <div className="flex items-center gap-4 mt-8">
              <span className="rounded-full bg-berry text-white text-[14px] font-medium uppercase tracking-[0.04em] px-5 py-2">{d.tag}</span>
              <span className="text-g5 text-[17px]">{cs.category}</span>
            </div>
            <Lines as="h1" className="t-h1 text-white mt-9 mb-7 max-w-[900px]">{cs.title}</Lines>
            <p className="text-g6 text-[17px] lg:text-[21px] m-0 max-w-[900px]" style={{ lineHeight: 1.55 }}>{cs.subtitle}</p>
          </Reveal>
        </div>
        <div className="bg-g1 container-x py-9 mt-12 lg:mt-20">
          <div className="max-w-[1312px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            {d.meta.map((k, i) => (<div key={k}><div className="text-[13px] uppercase tracking-[0.08em] text-g5">{k}</div><div className="text-white text-[16px] lg:text-[19px] mt-2.5" style={{ lineHeight: 1.3 }}>{cs.meta[i]}</div></div>))}
          </div>
        </div>
      </DarkHero>

      <Section>
        <div className="max-w-[1000px] mx-auto">
          <Reveal><EyebrowDraw dot="berry" line={false}>{d.challenge}</EyebrowDraw><p className="text-g1 text-[18px] lg:text-[22px] mt-6 mb-0" style={{ lineHeight: 1.6 }}>{cs.challenge}</p></Reveal>
          <Reveal className="mt-16"><EyebrowDraw dot="berry" line={false}>{d.approach}</EyebrowDraw>
            <Hairline className="mt-7" />
            {cs.approach.map((a, i) => (
              <div key={a.title}>
                <div className="grid grid-cols-[48px_1fr] lg:grid-cols-[72px_1fr] gap-5 lg:gap-10 py-8">
                  <span className="serif text-berry text-[28px] lg:text-[36px] leading-none">0{i + 1}</span>
                  <div><h3 className="font-sans font-medium text-g1 text-[20px] lg:text-[24px] m-0" style={{ lineHeight: 1.25 }}>{a.title}</h3><p className="text-gm text-[16px] lg:text-[19px] mt-2.5 mb-0" style={{ lineHeight: 1.55 }}>{a.body}</p></div>
                </div>
                <Hairline />
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-16"><EyebrowDraw dot="berry" line={false}>{d.results}</EyebrowDraw>
            <div className="grid md:grid-cols-3 gap-4 lg:gap-6 mt-7">{cs.results.map((r) => (<StatTile key={r.label} big={r.big} small={r.small} label={r.label} />))}</div>
            <p className="text-g1 text-[18px] lg:text-[22px] mt-10 mb-0" style={{ lineHeight: 1.6 }}>{cs.outcome}</p>
            {cs.quote && <div className="mt-14"><PullQuote text={cs.quote.text} attribution={cs.quote.attribution} /></div>}
          </Reveal>
        </div>
      </Section>

      <Section bg="#FAFAFA">
        <Reveal>
          <Carousel eyebrow={d.moreEyebrow} title={d.moreTitle}>
            {others.map((o) => (
              <Link key={o.title} to={o.to} className="card-hover block rounded-2xl overflow-hidden bg-white border border-silver no-underline w-[82vw] md:w-[440px] lg:w-[540px]">
                <div className="img-zoom" style={{ aspectRatio: "2.5", background: GRAD.aub }}>{o.image && <img src={o.image} alt="" loading="lazy" />}</div>
                <div className="p-7 lg:p-8"><div className="text-[14px] uppercase tracking-[0.06em] text-berry">{o.category}</div><h3 className="card-title font-sans font-medium text-g1 text-[20px] lg:text-[24px] mt-3 mb-0" style={{ lineHeight: 1.3 }}>{o.title}</h3></div>
              </Link>
            ))}
          </Carousel>
        </Reveal>
      </Section>

      <CTABand />
    </>
  );
}
