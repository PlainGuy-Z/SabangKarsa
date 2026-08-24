import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function TestimonialsSection() {
  const [containerInView, setContainerInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const testimonials = [
    {
      name: "Ahmad Rizki",
      role: t("testi-role-1"),
      comment: t("testi-comment-1"),
      rating: 5,
      image: "/images/sabanglogin.jpg"
    },
    {
      name: "Sarah Putri",
      role: t("testi-role-2"),
      comment: t("testi-comment-2"),
      rating: 5,
      image: "/images/testimonials/user2.jpg"
    },
    {
      name: "Budi Santoso",
      role: t("testi-role-3"),
      comment: t("testi-comment-3"),
      rating: 5,
      image: "/images/testimonials/user3.jpg"
    }
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
    <section ref={containerRef} className="py-16 md:py-20 px-4 section-gray mobile-py-8">
      {containerInView && (
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {t("testi-header")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mobile-px-4">
              {t("testi-line")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-emerald-500 border-2 [border-color:oklch(0.5809_0.0963_194.83)] rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-emerald-100 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-200">{testimonial.name}</div>
                    <div className="text-sm text-emerald-100">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
