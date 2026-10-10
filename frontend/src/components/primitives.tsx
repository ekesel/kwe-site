import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { reduced } from "@/motion";

/* ───────── Document title: "<page> — KWE Advisors"; no label = the site default from index.html ───────── */
const DEFAULT_TITLE = typeof document !== "undefined" ? document.title : "";
export function usePageTitle(label?: string) {
  useEffect(() => {
    document.title = label ? `${label} — KWE Advisors` : DEFAULT_TITLE;
  }, [label]);
}

/* ───────── Icons ───────── */
const PATHS: Record<string, ReactNode> = {
  arrow: <><path d="M3 12h18" /><path d="M14 5l7 7-7 7" /></>,
  ne: <path d="M7 17L17 7M9 7h8v8" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: <><circle cx="11" cy="11" r="6" /><path d="M16 16l5 5" /></>,
  share: <><path d="M9 13l6-6" /><path d="M10 17l-2 2a3 3 0 0 1-4-4l2-2" /><path d="M14 7l2-2a3 3 0 0 1 4 4l-2 2" /></>,
  linkedin: <path d="M4.5 9h3v10h-3zM6 4a1.8 1.8 0 1 1 0 3.6A1.8 1.8 0 0 1 6 4zM9.5 9h2.9v1.4c.4-.8 1.4-1.6 3-1.6 3.2 0 3.6 2.1 3.6 4.8V19h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3z" fill="currentColor" stroke="none" />,
  down: <><path d="M12 4v16" /><path d="M5 13l7 7 7-7" /></>,
};
export function Icon({ name, size = 16, className = "", label }: { name: keyof typeof PATHS | string; size?: number; className?: string; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {PATHS[name] ?? PATHS.arrow}
    </svg>
  );
}

/* ───────── Logo: the three-dot mark + wordmark ───────── */
export function Logo({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
        <circle cx={3.2} cy={17.6} r={2.2} /><circle cx={10.4} cy={12.4} r={2.8} /><circle cx={18.6} cy={6.2} r={3.4} />
      </svg>
      <span style={{ fontSize: size * 0.72, letterSpacing: "0.01em", lineHeight: 1, fontWeight: 500 }}>kwe advisors</span>
    </span>
  );
}

/* ───────── Section label: eyebrow + short rule ───────── */
export function Label({ children, index, className = "", as: Tag = "span" }: { children: ReactNode; index?: string; className?: string; as?: "span" | "h2" }) {
  return (
    <Tag className={`label t-eyebrow ${className}`}>
      {index && <span className="mr-4 tabular-nums">{index}</span>}
      {children}
    </Tag>
  );
}

/* ───────── Text link (the default action) and pill button ───────── */
export function TextLink({ to, href, children, className = "", external = false }: { to?: string; href?: string; children: ReactNode; className?: string; external?: boolean }) {
  const inner = (<>{children}<Icon name="arrow" size={14} /></>);
  if (to) return <Link to={to} className={`tlink ${className}`}>{inner}</Link>;
  return <a href={href} className={`tlink ${className}`} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{inner}</a>;
}

export function Button({ to, children, variant = "primary", type = "button", onClick }: { to?: string; children: ReactNode; variant?: "primary" | "light"; type?: "button" | "submit"; onClick?: () => void }) {
  const inner = (<><span>{children}</span><span className="ic"><Icon name="ne" size={16} /></span></>);
  if (to) return <Link to={to} className={`btn btn-${variant}`}>{inner}</Link>;
  return <button type={type} onClick={onClick} className={`btn btn-${variant}`}>{inner}</button>;
}

/* ───────── Media: graded image, fixed aspect ratio, scales 1.08 → 1 while it scrolls through the viewport ───────── */
export function useScaleOnScroll(ref: React.RefObject<HTMLElement | null>, from = 1.08) {
  useLayoutEffect(() => {
    const el = ref.current; const inner = el?.querySelector("img, video");
    if (!el || !inner || reduced()) return;
    const tw = gsap.fromTo(inner, { scale: from }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [ref, from]);
}

export function Media({ src, alt = "", ratio = "16x9", portrait = false, zoom = false, className = "", style, eager = false }: {
  src: string; alt?: string; ratio?: "16x9" | "4x5" | "1x1" | "fill"; portrait?: boolean; zoom?: boolean; className?: string; style?: CSSProperties; eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScaleOnScroll(ref);
  return (
    <div ref={ref} className={`media ${ratio !== "fill" ? `ratio-${ratio}` : ""} ${portrait ? "is-portrait" : ""} ${zoom ? "hover-zoom" : ""} ${className}`} style={style}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
    </div>
  );
}

/** Same 4:5 frame as a portrait, used when no real photograph of the person exists yet. */
export function InitialsPortrait({ name, className = "" }: { name: string; className?: string }) {
  const initials = name.replace(/,.*$/, "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className={`ratio-4x5 bg-forest-900 flex items-center justify-center ${className}`} role="img" aria-label={`${name} — photograph to follow`}>
      <span className="t-h2 text-sage-300" aria-hidden>{initials}</span>
    </div>
  );
}
