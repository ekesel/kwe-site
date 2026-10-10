import { Media } from "../primitives";

/** A full-bleed 16:9 pause between sections. */
export function FullBleedImage({ src, alt = "" }: { src: string; alt?: string }) {
  return <figure className="w-full"><Media src={src} alt={alt} ratio="16x9" /></figure>;
}
