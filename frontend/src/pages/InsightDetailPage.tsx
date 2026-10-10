import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useContent } from "@/content/ContentProvider";
import { GRAD, Icon, Reveal, usePageTitle } from "@/components/ui";
import { MetaRow, Section, VideoHero } from "@/components/sections";
import { RichText } from "@/components/richtext";
import { ArticleOutline } from "@/components/outline";
import NotFoundPage from "./NotFoundPage";

export default function InsightDetailPage() {
  const data = useContent();
  const n = data.insights;
  const { slug } = useParams();
  const a = n.items.find((x) => x.slug === slug);
  const articleRef = useRef<HTMLElement>(null);
  usePageTitle(a?.title);
  if (!a) return <NotFoundPage />;
  const t = n.article;
  const share = (
    <>
      <a href={data.site.linkedin} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="w-9 h-9 rounded-full border border-silver text-g1 inline-flex items-center justify-center hover:bg-g1 hover:text-white transition-colors"><Icon name="linkedin" size={14} /></a>
      <button aria-label="Copy link" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="w-9 h-9 rounded-full border border-silver text-g1 inline-flex items-center justify-center bg-transparent cursor-pointer hover:bg-g1 hover:text-white transition-colors"><Icon name="share" size={14} /></button>
    </>
  );
  const related = n.items.filter((x) => x.slug !== slug).slice(0, 3).map((x) => ({ category: x.category, title: x.title, image: x.image, to: `/insight/${x.slug}` }));
  return (
    <>
      <VideoHero tag={a.category} title={a.title} subtitle={a.subtitle} />
      <MetaRow back={{ to: "/insights", label: t.back }} items={[{ label: t.metaLabels[0], value: a.date }, { label: t.metaLabels[1], value: a.read }, { label: t.metaLabels[2], value: t.author }].filter((m) => m.value)} />

      <Section>
        <div className="grid lg:grid-cols-[4fr_9fr] gap-8 lg:gap-16 items-start">
          <aside className="lg:sticky lg:top-32 flex flex-col gap-7">
            <ArticleOutline articleRef={articleRef} label={t.outline} contentKey={a.slug} />
            <div className="hidden lg:flex gap-2">{share}</div>
          </aside>
          {/* not wrapped in <Reveal>: a whileInView threshold never triggers on an article this long */}
          <article ref={articleRef} className="max-w-[760px]">
            <RichText text={a.body} />
            <div className="flex lg:hidden gap-2 mt-12">{share}</div>
          </article>
        </div>
      </Section>

      <Section bg="#FAFAFA">
        <Reveal><div className="text-[14px] font-medium uppercase tracking-[0.08em] text-g1">{t.related}</div></Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {related.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <Link to={r.to} className="card-hover block rounded-xl overflow-hidden bg-white border border-silver no-underline h-full">
                <div className="img-zoom" style={{ aspectRatio: "2.2", background: GRAD.g1 }}>{r.image && <img src={r.image} alt="" loading="lazy" />}</div>
                <div className="p-5 pb-6"><div className="text-[12px] uppercase tracking-[0.08em] text-g3">{r.category}</div><h3 className="card-title font-sans font-medium text-g1 text-[17px] mt-2.5 mb-0" style={{ lineHeight: 1.35 }}>{r.title}</h3></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
