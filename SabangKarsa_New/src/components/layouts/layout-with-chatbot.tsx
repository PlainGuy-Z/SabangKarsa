import { type ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface LayoutWithChatbotProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export function LayoutWithChatbot({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: LayoutWithChatbotProps) {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar id="navbar" />}
      {children}
      {showFooter && <Footer />}
    </div>
  );
}
