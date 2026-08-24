import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { MapPin, Home, Car, MessageCircle, Users, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function FeaturesMarquee() {
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
    <section ref={containerRef} className="py-8 bg-emerald-500 dark:bg-emerald-800 overflow-hidden ">
      {containerInView && (
        <>
          <div className="mb-8">
            <motion.h2
              className="text-center text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {t("feat-header")}
            </motion.h2>
          </div>

          {/* Marquee Animation */}
          <div className="relative">
            <motion.div
              className="flex gap-8 text-white"
              animate={{ x: [0, -1000] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Repeat features for continuous scroll */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex gap-8 whitespace-nowrap">
                  <div className="flex items-center gap-4 text-lg font-semibold">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <span>{t("feat-ln-1")}</span>
                  </div>

                  <div className="flex items-center gap-4 text-lg font-semibold">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Home className="w-8 h-8" />
                    </div>
                    <span>{t("feat-ln-2")}</span>
                  </div>

                  <div className="flex items-center gap-4 text-lg font-semibold">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Car className="w-8 h-8" />
                    </div>
                    <span>{t("feat-ln-3")}</span>
                  </div>

                  <div className="flex items-center gap-4 text-lg font-semibold">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <span>{t("feat-ln-4")}</span>
                  </div>

                  <div className="flex items-center gap-4 text-lg font-semibold">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8" />
                    </div>
                    <span>{t("feat-ln-5")}</span>
                  </div>

                  <div className="flex items-center gap-4 text-lg font-semibold">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="w-8 h-8" />
                    </div>
                    <span>{t("feat-ln-6")}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </>
      )}
    </section>
  );
}
