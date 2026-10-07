import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";

/** Keep navigation immediate; respect motion preferences throughout the app. */
export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  const kind =
    pathname === "/"
      ? "home"
      : ["/login", "/register"].includes(pathname)
        ? "auth"
        : /dashboard|pemesanan|pesanan|booking|verification/.test(pathname)
          ? "workspace"
          : "public";
  return (
    <MotionConfig reducedMotion="user">
      <div className={`sk-app sk-app-${kind}`}>{children}</div>
    </MotionConfig>
  );
}
