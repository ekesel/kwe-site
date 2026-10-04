import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import MegaFooter from "./MegaFooter";
import { Loader, PageTransition, SmoothScroll, scrollToEl } from "@/motion";

export default function Root() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const t = setTimeout(() => scrollToEl(hash), 350); return () => clearTimeout(t); }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return (
    <>
      <Loader />
      <SmoothScroll />
      <NavBar />
      <PageTransition>
        <main>
          <Outlet />
        </main>
        <MegaFooter />
      </PageTransition>
    </>
  );
}
