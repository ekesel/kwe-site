import { useState, type FormEvent } from "react";
import { useContent } from "@/content/ContentProvider";
import { Button, TextLink, usePageTitle } from "@/components/primitives";
import { Hero } from "@/components/blocks/Hero";
import { Section } from "@/components/blocks/Section";
import { PlainGrid } from "@/components/blocks/GridList";
import { FadeUp } from "@/motion";

export default function ContactPage() {
  const data = useContent();
  const c = data.contact;
  usePageTitle(c.hero.eyebrow);
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  const f = c.form.fields;
  return (
    <>
      <Hero title={c.hero.title} subtitle={c.hero.subtitle} cueTarget="#form" />

      <Section id="form" label={c.form.eyebrow} title={c.form.title} intro={<>{c.form.body} <a href={`mailto:${c.form.email}`} className="inline-link">{c.form.email}</a></>}>
        <FadeUp>
          <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-x-6 gap-y-6 max-w-[880px]">
            <Field label={f.name.label} placeholder={f.name.placeholder} name="name" autoComplete="name" />
            <Field label={f.email.label} placeholder={f.email.placeholder} name="email" type="email" autoComplete="email" />
            <Field label={f.company.label} placeholder={f.company.placeholder} name="company" autoComplete="organization" wide />
            <Field label={f.message.label} placeholder={f.message.placeholder} name="message" textarea wide />
            <div className="md:col-span-2 mt-4" aria-live="polite">
              {sent ? <p className="t-body text-forest-900">{c.form.success}</p> : <Button type="submit">{c.form.submit}</Button>}
            </div>
          </form>
        </FadeUp>
      </Section>

      <Section label={c.offices.title}>
        <PlainGrid items={c.offices.items.map((o) => ({
          key: o.name, title: o.name,
          lines: [...o.address, o.tel, <a href={`mailto:${o.email}`} className="inline-link">{o.email}</a>, <span className="inline-block mt-4"><TextLink href={o.maps} external>{c.offices.mapsLabel}</TextLink></span>],
        }))} />
      </Section>

      <Section label={c.media.title}>
        <PlainGrid items={c.media.items.map((m) => ({ key: m.name, title: m.name, lines: [m.role, m.tel, <a href={`mailto:${m.email}`} className="inline-link">{m.email}</a>] }))} />
      </Section>
    </>
  );
}

function Field({ label, placeholder, name, type = "text", textarea = false, wide = false, autoComplete }: { label: string; placeholder: string; name: string; type?: string; textarea?: boolean; wide?: boolean; autoComplete?: string }) {
  return (
    <label className={`flex flex-col gap-2 ${wide ? "md:col-span-2" : ""}`}>
      <span className="t-small text-ink-2">{label}</span>
      {textarea
        ? <textarea name={name} placeholder={placeholder} rows={6} className="field" required />
        : <input name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} className="field" required />}
    </label>
  );
}
