import { Link, useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { EyebrowDraw } from "@/motion";
import { GRAD, Hairline, Reveal, usePageTitle } from "@/components/ui";
import { Carousel, MetaRow, Section, VideoHero } from "@/components/sections";
import { RichText } from "@/components/richtext";
import NotFoundPage from "./NotFoundPage";

export default function CaseStudyDetailPage() {
  const data = useContent();
  const c = data.caseStudies;
  const { slug } = useParams();
  const cs = c.items.find((x) => x.slug === slug);
  usePageTitle(cs?.title);
  if (!cs) return <NotFoundPage />;
  const d = c.detail;
  const others = [...c.items.filter((x) => x.slug !== slug).map((x) => ({ category: x.category, title: x.cardTitle, image: x.image, to: `/case-study/${x.slug}` }))];
  return (
    <>
      <VideoHero tag={cs.category} title={cs.title} subtitle={cs.subtitle} />
      <MetaRow back={{ to: "/case-studies", label: d.back }} items={d.meta.map((label, i) => ({ label, value: cs.meta[i] ?? "" })).filter((m) => m.value)} />

      <Section>
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <EyebrowDraw line={false}>{d.challenge}</EyebrowDraw>
            <h2 className="t-h3 text-g1 mt-5 mb-6">{cs.challenge.heading}</h2>
            <RichText text={cs.challenge.body} />
          </Reveal>
          <Reveal className="mt-16">
            <EyebrowDraw line={false}>{d.approach}</EyebrowDraw>
            <h2 className="t-h3 text-g1 mt-5 mb-0">{cs.approach.heading}</h2>
            <Hairline className="mt-7" />
            {cs.approach.steps.map((a, i) => (
              <div key={a.title}>
                <div className="grid grid-cols-[48px_1fr] lg:grid-cols-[72px_1fr] gap-5 lg:gap-10 py-8">
                  <span className="serif text-g3 text-[28px] lg:text-[36px] leading-none">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3 className="font-sans font-medium text-g1 text-[20px] lg:text-[24px] m-0 mb-3" style={{ lineHeight: 1.25 }}>{a.title}</h3><RichText text={a.body} size="sm" /></div>
                </div>
                <Hairline />
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-16">
            <EyebrowDraw line={false}>{d.results}</EyebrowDraw>
            <h2 className="t-h3 text-g1 mt-5 mb-6">{cs.results.heading}</h2>
            <div className="rounded-2xl bg-off p-7 lg:p-10"><RichText text={cs.results.body} /></div>
          </Reveal>
        </div>
      </Section>

      <Section bg="#FAFAFA">
        <Reveal>
          <Carousel eyebrow={d.moreEyebrow} title={d.moreTitle}>
            {others.map((o) => (
              <Link key={o.title} to={o.to} className="card-hover block rounded-2xl overflow-hidden bg-white border border-silver no-underline w-[82vw] md:w-[440px] lg:w-[540px]">
                <div className="img-zoom" style={{ aspectRatio: "2.5", background: GRAD.g1 }}>{o.image && <img src={o.image} alt="" loading="lazy" />}</div>
                <div className="p-7 lg:p-8"><div className="text-[14px] uppercase tracking-[0.06em] text-g3">{o.category}</div><h3 className="card-title font-sans font-medium text-g1 text-[20px] lg:text-[24px] mt-3 mb-0" style={{ lineHeight: 1.3 }}>{o.title}</h3></div>
              </Link>
            ))}
          </Carousel>
        </Reveal>
      </Section>
    </>
  );
}
