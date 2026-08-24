import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react";
import { Users, MapPin, Home, Award } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function StatsSection() {
  const [containerInView, setContainerInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const stats = [
    { icon: Users, number: "10K+", label: t("stats-li-1") },
    { icon: MapPin, number: "50+", label: t("stats-li-2") },
    { icon: Home, number: "100+", label: t("stats-li-3") },
    { icon: Award, number: "4.9", label: t("stats-li-4") }
  ]

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
    <section ref={containerRef} className="py-16 md:py-20 px-4 bg-emerald-500 dark:bg-emerald-800 mobile-py-8">
      {containerInView && (
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-white"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full mb-4">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-2xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
