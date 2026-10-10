import type { ReactNode } from "react";
import { FadeUp } from "@/motion";

/** One large serif paragraph across columns 4–12 (body text is never line-split), optional action below. */
export function Statement({ text, action, dark = false }: { text: ReactNode; action?: ReactNode; dark?: boolean }) {
  return (
    <>
      <FadeUp as="div"><p className={`t-h2 ${dark ? "text-white" : "text-forest-900"}`}>{text}</p></FadeUp>
      {action && <FadeUp className="mt-10">{action}</FadeUp>}
    </>
  );
}
