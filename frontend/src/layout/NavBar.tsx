import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { useShyHeader } from "@/motion";
import { Icon, Logo } from "@/components/primitives";

/** Full-width header: transparent over the hero, paper with a hairline after it; hides on scroll down, returns on scroll up. */
export default function NavBar() {
  const data = useContent();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const ref = useRef<HTMLElement>(null);
  useShyHeader(ref);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setOverHero(!!hero && hero.getBoundingClientRect().bottom > 80);
    };
    update(); const t = window.setTimeout(update, 400);
    window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.clearTimeout(t); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [pathname]);
  const light = overHero && !open; // white type on the video
  return (
    <>
      <header ref={ref} className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${light ? "bg-transparent text-white on-dark" : open ? "bg-forest-950 text-white on-dark" : "bg-paper text-forest-900 rule-b"}`}>
        <div className="wrap h-20 flex items-center justify-between gap-10">
          <Link to="/" aria-label="KWE Advisors — home" className="shrink-0"><Logo size={24} /></Link>
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
            {data.nav.links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `t-small font-medium relative py-1 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-current after:origin-left after:transition-transform after:duration-500 hover:after:scale-x-100 ${isActive ? "after:scale-x-100" : "after:scale-x-0"}`}>{l.label}</NavLink>
            ))}
            <Link to={data.nav.cta.to} className={`tlink ${light ? "text-white" : ""}`}>{data.nav.cta.label}<Icon name="arrow" size={14} /></Link>
          </nav>
          <button type="button" className="lg:hidden inline-flex items-center gap-3 t-small font-medium" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block w-5 h-3" aria-hidden>
              <span className="absolute left-0 right-0 h-px bg-current transition-transform duration-300" style={{ top: open ? 6 : 0, transform: open ? "rotate(45deg)" : "none" }} />
              <span className="absolute left-0 right-0 h-px bg-current transition-transform duration-300" style={{ top: open ? 6 : 12, transform: open ? "rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="fixed inset-0 z-40 bg-forest-950 text-white on-dark overflow-y-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.2, 0, 0.1, 1] }}>
            <nav aria-label="Mobile navigation" className="wrap pt-32 pb-16 flex flex-col">
              {data.nav.links.map((l) => (
                <NavLink key={l.to} to={l.to} className="t-h2 text-white py-4 rule-b">{l.label}</NavLink>
              ))}
              <div className="mt-10 flex flex-col gap-4">
                <Link to={data.nav.cta.to} className="tlink">{data.nav.cta.label}<Icon name="arrow" size={14} /></Link>
                <a href={`mailto:${data.site.email}`} className="t-small text-white/70">{data.site.email}</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
