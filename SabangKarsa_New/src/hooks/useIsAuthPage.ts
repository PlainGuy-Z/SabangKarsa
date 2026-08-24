import { useLocation } from "react-router-dom";

export function useIsAuthPage() {
  const location = useLocation();
  
  // Array of auth routes
  const authRoutes = ['/login', '/register'];
  
  return authRoutes.includes(location.pathname);
}
