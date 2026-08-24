import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { HeroSection } from "@/components/layouts/hero-section";
import { FeaturesMarquee } from "@/components/layouts/features-marquee";
import { ServicesSection } from "@/components/layouts/services-section";
import { ParallaxImageSection } from "@/components/layouts/parallax-image-section";
import { DestinationsSection } from "@/components/layouts/destinations-section";
import { StatsSection } from "@/components/layouts/stats-section";
import { TestimonialsSection } from "@/components/layouts/testimonials-section";
import { BusinessSolutionsSection } from "@/components/layouts/business-solutions-section";
import { CtaSection } from "@/components/layouts/cta-section";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar id="navbar" />
      <HeroSection />
      <FeaturesMarquee />
      <ServicesSection />
      <ParallaxImageSection />
      <DestinationsSection />
      <StatsSection />
      <TestimonialsSection />
      <BusinessSolutionsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
