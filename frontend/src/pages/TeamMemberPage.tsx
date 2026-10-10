import { Link, useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { ArrowRight, Hairline, Reveal, usePageTitle } from "@/components/ui";
import { Section } from "@/components/sections";
import NotFoundPage from "./NotFoundPage";

export default function TeamMemberPage() {
  const data = useContent();
  const { slug } = useParams();
  const m = data.team.members.find((x) => x.slug === slug);
  usePageTitle(m?.name);
  if (!m) return <NotFoundPage />;
  const p = data.team.profile;
  return (
    <>
      <Section className="pt-32 lg:pt-40">
        <div className="grid lg:grid-cols-[7fr_8fr] gap-10 lg:gap-16 items-start">
          <Reveal className="order-2 lg:order-1">
            <Link to="/team" className="inline-flex items-center gap-2.5 rounded-full bg-off pl-3.5 pr-4 py-2.5 text-[15px] font-medium text-g1 no-underline hover:bg-silver transition-colors"><ArrowRight rotate={180} size={14} />{p.back}</Link>
            <h1 className="font-sans font-normal text-g1 text-[36px] md:text-[44px] lg:text-[56px] mt-8 mb-3" style={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}>{m.name}</h1>
            <p className="text-g1 text-[20px] m-0">{m.role}</p>
            <p className="text-g3 text-[17px] mt-2 mb-0">{m.credential}</p>
            <Hairline className="mt-14 mb-7" />
            <div className="grid grid-cols-2 gap-6">
              <div><div className="font-medium text-[17px] text-g1">{p.focusLabel}</div><div className="text-[17px] text-g1 mt-1.5">{m.focus}</div></div>
              <div><div className="font-medium text-[17px] text-g1">{p.connectLabel}</div><a href={data.site.linkedin} target="_blank" rel="noreferrer" className="text-[17px] text-g1 underline mt-1.5 inline-block">{p.connectValue}</a></div>
            </div>
            {m.bio.length > 0 && <div className="mt-14 space-y-5">
              {m.bio.map((para, i) => (<p key={i} className="text-g1 text-[18px] m-0" style={{ lineHeight: 1.55 }}>{para}</p>))}
            </div>}
            {m.firms.length > 0 && <>
              <div className="mt-16 text-[15px] font-medium uppercase tracking-[0.02em] text-g1">{p.firmsLabel}</div>
              <Hairline className="mt-3 mb-7" />
              <ul className="list-none p-0 m-0 space-y-2.5">{m.firms.map((f) => (<li key={f} className="text-g1 text-[18px]">{f}</li>))}</ul>
            </>}
          </Reveal>
          <Reveal className="order-1 lg:order-2 img-zoom rounded-lg grad-dark" style={{ aspectRatio: "0.72" }}>{m.image && <img src={m.image} alt={m.name} />}</Reveal>
        </div>
      </Section>
    </>
  );
}
