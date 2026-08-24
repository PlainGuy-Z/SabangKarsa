import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { TransitionPage } from "../../pages/TransitionPage";
import { usePageTransition } from "@/hooks/usePageTransition";

interface PageTransitionWrapperProps {
  children: ReactNode;
}

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const location = useLocation();
  const { isTransitioning, completeTransition, duration } = usePageTransition({
    duration: 4000,
    excludeRoutes: ['/login', '/register']
  });

  if (isTransitioning) {
    return (
      <TransitionPage 
        onComplete={completeTransition}
        duration={duration}
        targetPage={location.pathname}
      />
    );
  }

  return <>{children}</>;
}
