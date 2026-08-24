import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react";
import { Home, Car, UserCheck } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function BusinessSolutionsSection() {
  const [containerInView, setContainerInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

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
    <section ref={containerRef} className="py-20 px-4 section-white">
      {containerInView && (
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {t("bs-title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              {t("bs-line-1")}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="theme-card rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Home className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("bs-point-1")}</h3>
              <p className="text-muted-foreground">
                {t("bs-point-1-ln")}
              </p>
            </motion.div>
            
            <motion.div
              className="theme-card rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Car className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("bs-point-2")}</h3>
              <p className="text-muted-foreground">
                {t("bs-point-2-ln")}
              </p>
            </motion.div>
            
            <motion.div
              className="theme-card rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("bs-point-3")}</h3>
              <p className="text-muted-foreground">
                {t("bs-point-3-ln")}
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  )
}
