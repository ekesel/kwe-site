import data from "@/data";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { Eyebrow, Hairline, Reveal } from "@/components/ui";
import { CTABand, VideoHero } from "@/components/sections";

const l = data.legal;

export default function LegalPage() {
  return (
    <>
      <VideoHero eyebrow={l.eyebrow} title={l.title} subtitle={l.updated} height="70svh" />
      <section className="section container-x">
        <div className="max-w-[760px] mx-auto">
          {l.sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.06} className="mb-12">
              <h2 className="t-h3 text-g1 mb-4">{s.heading}</h2>
              <Hairline />
              <p className="text-gm text-[16px] mt-5 mb-0" style={{ lineHeight: 1.7 }}>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CTABand />
    </>
  );
}
