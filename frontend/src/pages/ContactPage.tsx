import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { EyebrowDraw, Lines, Parallax } from "@/motion";
import { ArrowRight, EASE_OUT, Eyebrow, Hairline, Icon, Reveal, ScrollCue } from "@/components/ui";
import { Section } from "@/components/sections";

export default function ContactPage() {
  const data = useContent();
  const c = data.contact;
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  const f = c.form.fields;
  return (
    <>
      {/* Hero — concentric signal rings */}
      <section className="relative grad-dark text-white overflow-hidden flex flex-col items-center justify-center text-center container-x" style={{ minHeight: "100svh", paddingTop: 140, paddingBottom: 120 }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[0.45, 0.7, 0.95, 1.2].map((k) => (<span key={k} className="absolute rounded-full border border-white/[0.08]" style={{ width: `${k * 200}vw`, height: `${k * 200}vw`, left: "50%", top: "72%", transform: "translate(-50%,-50%)" }} />))}
        </div>
        <motion.div className="relative" initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.4 }}><EyebrowDraw dark dot="berry" line={false}>{c.hero.eyebrow}</EyebrowDraw></motion.div>
        <motion.h1 className="relative t-display text-white mt-6 mb-0 max-w-[1000px]" initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.55 }}>{c.hero.title}</motion.h1>
        <motion.p className="relative t-lead text-g6 mt-7 mb-0 max-w-[720px]" initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.75 }}>{c.hero.subtitle}</motion.p>
        <motion.div className="relative flex flex-wrap justify-center gap-4 mt-12" initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.9 }}>
          <a href="#form" className="inline-flex items-center gap-5 rounded-full bg-white text-g1 pl-8 pr-3 py-3 text-[17px] lg:text-[20px] font-medium no-underline"><span>{c.hero.email}</span><span className="w-12 h-12 rounded-full bg-g1 text-white inline-flex items-center justify-center"><ArrowRight size={18} /></span></a>
          <a href={data.site.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-white/30 text-white px-9 py-6 text-[17px] lg:text-[20px] font-medium no-underline hover:bg-white/10 transition-colors"><Icon name="linkedin" size={18} />{c.hero.linkedin}</a>
        </motion.div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-7 lg:bottom-10"><ScrollCue label={data.home.hero.scrollCue} href="#form" /></div>
      </section>

      {/* Form panel */}
      <Section id="form">
        <Reveal className="panel bg-warm grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-24 lg:p-20">
          <div>
            <EyebrowDraw dot="berry" line={false}>{c.form.eyebrow}</EyebrowDraw><Hairline className="mt-5" />
            <Lines as="h1" className="t-h1 text-g1 mt-12 mb-7">{c.form.title}</Lines>
            <p className="text-gm text-[17px] lg:text-[20px] m-0" style={{ lineHeight: 1.6 }}>{c.form.body}</p>
            <a href={`mailto:${c.form.email}`} className="inline-block text-g1 text-[19px] mt-10 no-underline">{c.form.email}</a>
          </div>
          <form onSubmit={onSubmit} className="rounded-[20px] bg-white p-7 lg:p-12 flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={f.name.label} placeholder={f.name.placeholder} name="name" />
              <Field label={f.email.label} placeholder={f.email.placeholder} name="email" type="email" />
            </div>
            <Field label={f.company.label} placeholder={f.company.placeholder} name="company" />
            <Field label={f.message.label} placeholder={f.message.placeholder} name="message" textarea />
            {sent ? (
              <p className="text-g1 text-[16px] m-0 mt-2">{c.form.success}</p>
            ) : (
              <button type="submit" className="self-start inline-flex items-center gap-5 rounded-full bg-g1 text-white pl-10 pr-3 py-3 text-[20px] font-medium border-0 cursor-pointer mt-2"><span>{c.form.submit}</span><span className="w-[52px] h-[52px] rounded-full bg-berry text-white inline-flex items-center justify-center"><ArrowRight size={18} rotate={-45} /></span></button>
            )}
          </form>
        </Reveal>
      </Section>

      {/* Offices + Media contacts */}
      <Section>
        <div className="max-w-[1000px] mx-auto">
          <Reveal><h2 className="font-sans font-normal text-g1 text-[32px] lg:text-[44px] m-0" style={{ letterSpacing: "-0.01em" }}>{c.offices.title}</h2></Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 mt-16">
            {c.offices.items.map((o, i) => (
              <Reveal key={o.name} delay={i * 0.08}>
                <div className="font-medium text-g1 text-[17px]">{o.name}</div>
                <p className="text-g1 text-[15px] mt-3 mb-0" style={{ lineHeight: 1.5 }}>{o.address.map((l) => (<span key={l} className="block">{l}</span>))}</p>
                <div className="text-gm text-[14px] mt-5">Tel</div><div className="text-g1 text-[15px] mt-1.5">{o.tel}</div>
                <div className="text-gm text-[14px] mt-4">Email</div><a href={`mailto:${o.email}`} className="text-g1 text-[15px] mt-1.5 inline-block underline">{o.email}</a>
                <a href={o.maps} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-g1 text-white pl-4 pr-2 py-2 text-[13px] font-medium no-underline">{c.offices.mapsLabel}<span className="w-[22px] h-[22px] rounded-full bg-white text-g1 inline-flex items-center justify-center"><ArrowRight size={10} rotate={-45} /></span></a>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-24"><h2 className="font-sans font-normal text-g1 text-[32px] lg:text-[44px] m-0" style={{ letterSpacing: "-0.01em" }}>{c.media.title}</h2></Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mt-16">
            {c.media.items.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="font-medium text-g1 text-[17px]">{m.name}</div><div className="text-g1 text-[15px] mt-2">{m.role}</div>
                <div className="text-gm text-[14px] mt-5">Tel</div><div className="text-g1 text-[15px] mt-1.5">{m.tel}</div>
                <div className="text-gm text-[14px] mt-4">Email</div><a href={`mailto:${m.email}`} className="text-g1 text-[15px] mt-1.5 inline-block underline">{m.email}</a>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({ label, placeholder, name, type = "text", textarea = false }: { label: string; placeholder: string; name: string; type?: string; textarea?: boolean }) {
  const cls = "w-full rounded-xl border border-silver bg-white px-6 py-5 text-[18px] text-g1 placeholder:text-gl outline-none transition-colors duration-200 focus:border-g1";
  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-gm text-[16px]">{label}</span>
      {textarea ? <textarea name={name} placeholder={placeholder} rows={5} className={cls} required /> : <input name={name} type={type} placeholder={placeholder} className={cls} required />}
    </label>
  );
}
