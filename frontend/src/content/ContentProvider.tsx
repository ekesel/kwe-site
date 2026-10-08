import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Loader } from "@/motion";
export type SiteData = typeof import("../data.json");

const ContentContext = createContext<SiteData | null>(null);

const MAX_ATTEMPTS = 4;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS && !cancelled; attempt++) {
        try {
          const res = await fetch("/api/content/");
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = (await res.json()) as { data: SiteData; updated_at?: string };
          if (!cancelled) setData(json.data);
          return;
        } catch (err) {
          console.error(`Content fetch failed (attempt ${attempt}/${MAX_ATTEMPTS})`, err);
          if (attempt < MAX_ATTEMPTS) await sleep(500 * 2 ** (attempt - 1));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return <Loader />;
  return <ContentContext.Provider value={data}>{children}</ContentContext.Provider>;
}

export function useContent(): SiteData {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a <ContentProvider>");
  return ctx;
}
