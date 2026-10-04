import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";
import { Link } from "react-router-dom";
import { scrollToEl } from "@/motion";

/* ───────── Motion: cinven-style fadeUp reveals ───────── */
export const EASE_OUT: [number, number, number, number] = [0.2, 0, 0.1, 1];

export function Reveal({
  children, delay = 0, y = 30, className, style, as = "div", once = true, amount = 0.2,
}: { children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties; as?: "div" | "section" | "li" | "span"; once?: boolean; amount?: number }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}

/** Staggers direct children: eyebrow → heading → content, like the Figma prototype. */
export function RevealGroup({ children, className, stagger = 0.1, y = 30 }: { children: ReactNode; className?: string; stagger?: number; y?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {Array.isArray(children)
        ? children.map((c, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } } }}>
              {c}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } } };
export const itemFar = { hidden: { opacity: 0, y: 100 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } } };

/* ───────── Primitives ───────── */
export function Eyebrow({ children, dark = false, dot = "g3", className = "" }: { children: ReactNode; dark?: boolean; dot?: "g3" | "berry" | "none"; className?: string }) {
  return (
    <span className={`eyebrow ${dark ? "dark" : ""} ${className}`}>
      {dot !== "none" && <span className={`dot ${dot === "berry" ? "berry" : ""}`} />}
      {children}
    </span>
  );
}

export function ArrowRight({ size = 16, rotate = 0 }: { size?: number; rotate?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <path d="M2 8h12" /><path d="M9 3l5 5-5 5" />
    </svg>
  );
}

export function Button({ to, href, children, variant = "primary", arrow = 0, className = "", onClick, type }: { to?: string; href?: string; children: ReactNode; variant?: "primary" | "secondary" | "ondark" | "accent"; arrow?: number; className?: string; onClick?: () => void; type?: "button" | "submit" }) {
  const cls = `btn btn-${variant} ${className}`;
  const inner = (<><span>{children}</span><span className="ic"><ArrowRight size={16} rotate={arrow} /></span></>);
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a>;
  return <button type={type ?? "button"} className={cls} onClick={onClick}>{inner}</button>;
}

export function TextLink({ to, href, children, tone = "dark", className = "" }: { to?: string; href?: string; children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  const cls = `tlink ${tone === "dark" ? "text-g1 berry-hover" : "text-white"} ${className}`;
  const inner = (<>{children}<ArrowRight size={14} /></>);
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <a href={href} className={cls}>{inner}</a>;
}

export function ScrollCue({ label, href = "#content" }: { label: string; href?: string }) {
  return (
    <a href={href} className="scroll-cue" onClick={(e) => { e.preventDefault(); scrollToEl(href, 0); }}>
      {label}
      <span className="ic"><ArrowRight size={14} rotate={90} /></span>
    </a>
  );
}

export function Hairline({ className = "", color }: { className?: string; color?: string }) {
  return <div className={`hair ${className}`} style={color ? { background: color } : undefined} />;
}

/* ───────── Icons (line set used across sections) ───────── */
const PATHS: Record<string, ReactNode> = {
  puzzle: <path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 0 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 1 0-4z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.5" /><path d="M15 15a5 5 0 0 1 6 5" /></>,
  doc: <><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5" /><path d="M9 15l2 2 4-4" /></>,
  bank: <><path d="M3 10l9-6 9 6" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14z" /><path d="M5 19l8-8" /></>,
  map: <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  star: <><circle cx="10" cy="8" r="3.5" /><path d="M4 20a6 6 0 0 1 10-4" /><path d="M17 14l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" /></>,
  layers: <><path d="M8 6h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8z" /><path d="M8 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" /></>,
  check: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h4M9 16l2 2 4-4" /></>,
  chevron: <path d="M6 9l6 6 6-6" />,
  search: <><circle cx="11" cy="11" r="6" /><path d="M16 16l5 5" /></>,
  sliders: <><path d="M4 7h16M4 17h16" /><circle cx="15" cy="7" r="2" fill="currentColor" /><circle cx="9" cy="17" r="2" fill="currentColor" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  linkedin: <path d="M4.5 9h3v10h-3zM6 4a1.8 1.8 0 1 1 0 3.6A1.8 1.8 0 0 1 6 4zM9.5 9h2.9v1.4c.4-.8 1.4-1.6 3-1.6 3.2 0 3.6 2.1 3.6 4.8V19h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3z" fill="currentColor" stroke="none" />,
  share: <><path d="M9 13l6-6" /><path d="M10 17l-2 2a3 3 0 0 1-4-4l2-2" /><path d="M14 7l2-2a3 3 0 0 1 4 4l-2 2" /></>,
  ne: <path d="M7 17L17 7M9 7h8v8" />,
};
export function Icon({ name, size = 24, className = "", strokeWidth = 1.6 }: { name: string; size?: number; className?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[name] ?? PATHS.target}
    </svg>
  );
}

/* ───────── Logo ───────── */
export function Logo({ inverted = true, size = 22 }: { inverted?: boolean; size?: number }) {
  const fill = inverted ? "#FFFFFF" : "#061B20";
  return (
    <span className="inline-flex items-center gap-2" style={{ color: fill }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx={3.2} cy={17.6} r={2.2} fill={fill} /><circle cx={10.4} cy={12.4} r={2.8} fill={fill} /><circle cx={18.6} cy={6.2} r={3.4} fill={fill} />
      </svg>
      <span style={{ fontSize: size * 0.68, letterSpacing: "0.02em", lineHeight: 1 }}>kwe advisors</span>
    </span>
  );
}

/* ───────── Tone helpers ───────── */
export const TONE_BG: Record<string, string> = { g1: "#061B20", g2: "#2D4748", g3: "#4C6569", g4: "#729597", g5: "#9CB5B9", g6: "#C5D4D7", berry: "#824270", aub: "#3B1931", sage: "#DCE5E6", off: "#FAFAFA", white: "#fff" };
export const TONE_FG: Record<string, string> = { g1: "#fff", g2: "#fff", g3: "#fff", g4: "#fff", g5: "#061B20", g6: "#061B20", berry: "#fff", aub: "#fff", sage: "#061B20", off: "#061B20", white: "#061B20" };
export const GRAD: Record<string, string> = {
  g1: "linear-gradient(135deg,#061B20,#2D4748)", g2: "linear-gradient(135deg,#2D4748,#4C6569)", berry: "linear-gradient(135deg,#3B1931,#824270)", aub: "linear-gradient(180deg,#3B1931,#061B20)", g4: "linear-gradient(180deg,#729597,#061B20)",
};
