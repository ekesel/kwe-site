import { useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { Hairline, Reveal, usePageTitle } from "@/components/ui";
import { VideoHero } from "@/components/sections";
import { RichText } from "@/components/richtext";
import NotFoundPage from "./NotFoundPage";

export default function LegalDocPage() {
  const data = useContent();
  const { slug } = useParams();
  const doc = data.legal.documents.find((d) => d.slug === slug);
  usePageTitle(doc?.title);
  if (!doc) return <NotFoundPage />;
  return (
    <>
      <VideoHero title={doc.title} subtitle={doc.updated} />
      <section id="content" className="section container-x">
        <div className="max-w-[760px] mx-auto">
          <Reveal className="mb-12">
            <p className="inline-flex items-center gap-2.5 rounded-full bg-off border border-silver px-4 py-2 text-[13px] font-medium text-g1 m-0" title={doc.complianceNote}>
              <span className="w-1.5 h-1.5 rounded-full bg-g3" />{data.legal.draftNote}
            </p>
            <RichText text={doc.intro} size="sm" className="mt-6" />
          </Reveal>
          {doc.sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.04} className="mb-12">
              <h2 className="t-h3 text-g1 mb-4">{s.heading}</h2>
              <Hairline />
              <RichText text={s.body} size="sm" className="mt-5" />
            </Reveal>
          ))}
          <Reveal><Hairline /><p className="text-gl text-[13px] mt-5 mb-0" style={{ lineHeight: 1.6 }}>{doc.disclaimer}</p></Reveal>
        </div>
      </section>
    </>
  );
}
