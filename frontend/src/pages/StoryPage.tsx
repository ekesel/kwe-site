import { useContent } from "@/content/ContentProvider";
import { TextLink, usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { Statement } from "@/components/blocks/Statement";
import { NumberedRows } from "@/components/blocks/NumberedRows";
import { FigureRow } from "@/components/blocks/FigureRow";
import { FadeUp } from "@/motion";

export default function StoryPage() {
  const data = useContent();
  const s = data.story;
  usePageTitle(s.hero.eyebrow);
  return (
    <>
      <Hero title={s.hero.title} subtitle={s.hero.subtitle} />

      <Section id="content" label={s.who.eyebrow} title={s.who.title}>
        <NumberedRows rows={s.who.pillars.map((p) => ({ title: p.title, body: p.body }))} />
        <div className="mt-16"><FigureRow items={s.who.stats} /></div>
        <FadeUp className="mt-16"><TextLink to={s.who.button.to}>{s.who.button.label}</TextLink></FadeUp>
      </Section>

      <Section id="mission" label={s.mission.eyebrow}>
        <Statement text={s.mission.statement} />
      </Section>

      <Section id="background" label={s.background.eyebrow} title={s.background.title}>
        <NumberedRows rows={s.background.rows.map((r) => ({ index: r.n, title: r.label, body: r.body }))} />
        <FadeUp className="mt-16"><TextLink to={s.background.button.to}>{s.background.button.label}</TextLink></FadeUp>
      </Section>

      {/* the page's one dark band */}
      <Section id="respond" dark label={s.respond.eyebrow} title={s.respond.title} intro={s.respond.lead}>
        <NumberedRows rows={s.respond.steps.map((st) => ({ index: st.n.padStart(2, "0"), title: st.title, body: st.body }))} />
        <FadeUp className="mt-16"><TextLink to={s.respond.button.to}>{s.respond.button.label}</TextLink></FadeUp>
      </Section>

      <Section id="vision" label={s.vision.eyebrow}>
        <Statement text={`${s.vision.before}${s.vision.highlight}${s.vision.after}`} />
      </Section>

      <Section label={s.milestones.eyebrow} title={s.milestones.title}>
        <NumberedRows rows={s.milestones.items.map((m) => ({ index: m.year, title: m.text }))} />
      </Section>

      <Section title={s.teamTeaser.title}>
        <FadeUp><TextLink to={s.teamTeaser.link.to}>{s.teamTeaser.link.label}</TextLink></FadeUp>
      </Section>
    </>
  );
}
