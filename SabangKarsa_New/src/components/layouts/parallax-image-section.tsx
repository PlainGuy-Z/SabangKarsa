import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function ParallaxImageSection() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
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
    <section ref={containerRef} className="relative h-96 overflow-hidden">
      {containerInView && (
        <>
          <motion.div 
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url('/assets/destinasi/pantaiiboih.webp')`,
              y: backgroundY,
              scale: 1.4
              
            }}
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t("pis-title")}
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mobile-px-4">
                {t("pis-line")}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </section>
  )
}
