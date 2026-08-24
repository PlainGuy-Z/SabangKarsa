import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface UsePageTransitionProps {
  duration?: number;
  excludeRoutes?: string[];
}

export function usePageTransition({ 
  duration = 4000, 
  excludeRoutes = ['/login', '/register'] 
}: UsePageTransitionProps = {}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Don't show transition on initial load or excluded routes
    if (previousPath === null || excludeRoutes.includes(currentPath) || excludeRoutes.includes(previousPath)) {
      setPreviousPath(currentPath);
      return;
    }

    // Show transition when navigating between pages
    if (previousPath !== currentPath) {
      setIsTransitioning(true);
      setPreviousPath(currentPath);
    }
  }, [location.pathname, previousPath, excludeRoutes]);

  const completeTransition = () => {
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    completeTransition,
    duration
  };
}
