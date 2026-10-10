import { useContent } from "@/content/ContentProvider";
import { usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { Statement } from "@/components/blocks/Statement";
import { NumberedRows } from "@/components/blocks/NumberedRows";
import { Accordion } from "@/components/blocks/Accordion";

export default function ProcessPage() {
  const data = useContent();
  const p = data.process;
  usePageTitle(p.hero.eyebrow);
  return (
    <>
      <Hero title={p.hero.title} subtitle={p.hero.subtitle} cueTarget="#phases" />

      <Section id="phases" label={p.stepper.eyebrow}>
        <NumberedRows large rows={p.stepper.steps.map((s) => ({ index: s.n, title: s.title, body: <><span className="block text-forest-900 font-medium mb-4">{s.lead}</span>{s.body}</> }))} />
      </Section>

      <Section label={p.why.eyebrow} title={p.why.title}>
        <NumberedRows rows={p.why.cards.map((c) => ({ title: c.title, body: c.body }))} />
      </Section>

      {/* the page's one dark band */}
      <Section dark>
        <Statement dark text={`${p.timeline.figure} ${p.timeline.text}`} />
        <div className="mt-16"><NumberedRows rows={p.timeline.nodes.map((n) => ({ title: n }))} /></div>
      </Section>

      <Section label={p.faq.eyebrow} title={p.faq.title}>
        <Accordion items={p.faq.items} />
      </Section>
    </>
  );
}
