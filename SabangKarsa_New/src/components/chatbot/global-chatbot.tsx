import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChatbotButton } from "@/components/chatbot/chatbot-button";

export function GlobalChatbot() {
  const location = useLocation();
  const navbarRef = useRef<HTMLElement>(null);
  
  // Array of routes where chatbot should not appear
  const excludedRoutes = ['/login', '/register'];
  
  // Find the navbar element on mount and route changes
  useEffect(() => {
    const findNavbar = () => {
      const navElement = document.querySelector('#navbar') as HTMLElement;
      if (navElement && navbarRef.current !== navElement) {
        navbarRef.current = navElement;
      }
    };
    
    // Find navbar immediately
    findNavbar();
    
    // Also check after a small delay to ensure DOM is ready
    const timer = setTimeout(findNavbar, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Don't render chatbot on auth pages
  if (excludedRoutes.includes(location.pathname)) {
    return null;
  }

  return <ChatbotButton navbar={navbarRef} />;
}
