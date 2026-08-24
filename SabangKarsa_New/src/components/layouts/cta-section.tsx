import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function CtaSection() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  const [containerInView, setContainerInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error(t("cta-err-msg"), error)
      }
    }
  }, [t]);

  useEffect(() => {
    const bodyElement = document.body;

    const checkInViewState = () => {
      const bodyScrollTop = bodyElement.scrollTop;
      const bodyScrollBottom = bodyScrollTop + window.innerHeight;
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect && (containerRect.y > bodyScrollTop && containerRect.y < bodyScrollBottom))
        setContainerInView(true);
    };

    checkInViewState();

    if (!containerInView) window.addEventListener("scroll", checkInViewState);

    return () => window.removeEventListener("scroll", checkInViewState);
  }, [containerRef, containerInView]);

  return (
    <section ref={containerRef} className="py-20 px-4 section-emerald">
      {containerInView && (
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t("cta-header")}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("cta-p")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mobile-stack">
              {user ? (
                <>
                  <Button 
                    onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-primary hover:bg-white/90 bg-emerald-500 dark:text-white dark:hover:bg-emerald-700 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 rounded-full shadow-lg mobile-full"
                  >
                    {t("cta-button-11")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={() => alert(t("cta-alert"))}
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/20 hover:backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-full mobile-full"
                  >
                    {t("cta-button-12")}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/register')}

                    className="bg-white text-primary hover:bg-white/90 bg-emerald-500 dark:text-white dark:hover:bg-emerald-700 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 rounded-full shadow-lg mobile-full"
>
                    {t("cta-button-21")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/20 hover:backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-full mobile-full"
                  >
                    {t("cta-button-22")}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
