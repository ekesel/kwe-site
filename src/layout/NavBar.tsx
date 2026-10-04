import { useEffect, useRef, useState } from "react";
import { useShyHeader } from "@/motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import data from "@/data";
import { Button, Icon, Logo } from "@/components/ui";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  useShyHeader(navRef);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center"
        style={{ top: 24, width: "min(1280px, calc(100% - 48px))", height: 68, borderRadius: 24, background: "rgba(6,27,32,0.92)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", paddingLeft: 28, paddingRight: 12 }}
      >
        <Link to="/" aria-label="KWE Advisors home" className="shrink-0"><Logo inverted size={22} /></Link>

        <div className="hidden lg:flex flex-1 items-center justify-center gap-9">
          {data.nav.links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link relative text-[15px] font-medium text-white no-underline transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-85 hover:opacity-100"}`}>
              {({ isActive }) => (<><span>{l.label}</span><span className="absolute left-0 right-0 -bottom-1 h-px bg-white origin-left transition-transform duration-[600ms]" style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)", transitionTimingFunction: "cubic-bezier(.87,0,.13,1)" }} /></>)}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <a href={data.site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-g5 hover:text-white transition-colors"><Icon name="linkedin" size={18} /></a>
          <Link to={data.nav.cta.to} className="inline-flex items-center rounded-full bg-white text-g1 text-[14px] font-medium px-5 py-3 no-underline transition-colors hover:bg-g6">{data.nav.cta.label}</Link>
        </div>

        <button className="lg:hidden ml-auto inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span className="relative block w-5 h-3">
            <span className="absolute left-0 right-0 h-px bg-white transition-transform duration-300" style={{ top: open ? 6 : 0, transform: open ? "rotate(45deg)" : "none" }} />
            <span className="absolute left-0 right-0 h-px bg-white transition-opacity duration-300" style={{ top: 6, opacity: open ? 0 : 1 }} />
            <span className="absolute left-0 right-0 h-px bg-white transition-transform duration-300" style={{ top: open ? 6 : 12, transform: open ? "rotate(-45deg)" : "none" }} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-g1 flex flex-col overflow-y-auto"
            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
          >
            <div className="flex-1 flex flex-col justify-center px-8 pt-32 pb-10 gap-6">
              {data.nav.links.map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: [0.2, 0, 0.1, 1] }}>
                  <NavLink to={l.to} className="serif text-white text-[34px] leading-none no-underline">{l.label}</NavLink>
                </motion.div>
              ))}
            </div>
            <div className="px-8 pb-10 flex flex-col gap-4">
              <Button to={data.nav.cta.to} variant="ondark">{data.nav.cta.label}</Button>
              <a href={`mailto:${data.site.email}`} className="text-g5 text-sm">{data.site.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
