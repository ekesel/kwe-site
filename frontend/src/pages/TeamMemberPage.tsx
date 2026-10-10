import { useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { InitialsPortrait, Media, TextLink, usePageTitle } from "@/components/primitives";
import { Icon } from "@/components/primitives";
import { Link } from "react-router-dom";
import { FadeUp, Lines } from "@/motion";
import NotFoundPage from "./NotFoundPage";

export default function TeamMemberPage() {
  const data = useContent();
  const { slug } = useParams();
  const m = data.team.members.find((x) => x.slug === slug);
  usePageTitle(m?.name);
  if (!m) return <NotFoundPage />;
  const p = data.team.profile;
  return (
    <section>
      <div className="wrap section-full !pt-40 lg:!pt-56">
        <div className="grid-12 gap-y-10">
          <div className="lead-col"><Link to="/team" className="tlink"><Icon name="arrow" size={14} className="rotate-180" />{p.back}</Link></div>
          <div className="main-col grid md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] gap-10 lg:gap-16 items-start">
            <div>
              <Lines as="h1" className="t-h1 text-forest-900">{m.name}</Lines>
              <p className="t-body text-forest-900 mt-6">{m.role}</p>
              {m.credential && <p className="t-body text-ink-2">{m.credential}</p>}
              <dl className="grid grid-cols-2 rule-t rule-b mt-10">
                <div className="py-4 pr-6"><dt className="t-eyebrow text-ink-2">{p.focusLabel}</dt><dd className="t-small text-forest-900 mt-2">{m.focus}</dd></div>
                <div className="py-4 pr-6"><dt className="t-eyebrow text-ink-2">{p.connectLabel}</dt><dd className="mt-2"><TextLink href={data.site.linkedin} external>{p.connectValue}</TextLink></dd></div>
              </dl>
              {m.bio.length > 0 && <FadeUp className="mt-10 space-y-6">{m.bio.map((para, i) => (<p key={i} className="t-body text-ink">{para}</p>))}</FadeUp>}
              {m.firms.length > 0 && (
                <FadeUp className="mt-16">
                  <h2 className="t-eyebrow text-ink-2 pb-4">{p.firmsLabel}</h2>
                  <ul className="rule-b">{m.firms.map((f) => (<li key={f} className="rule-t py-4 t-body text-forest-900">{f}</li>))}</ul>
                </FadeUp>
              )}
            </div>
            <FadeUp>{m.image ? <Media src={m.image} alt={m.name} ratio="4x5" portrait eager /> : <InitialsPortrait name={m.name} />}</FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
