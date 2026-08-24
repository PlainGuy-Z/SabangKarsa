import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Destinations from "../../data/destinations.json"
import { Star, Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  price: string;
  category: string;
}

export function DestinationsSection() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const destData = localStorage.getItem("language")?.toLowerCase() === "id" ? Destinations.id : Destinations.en;
  const destinations: Destination[] = destData.slice(0, 4);
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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error(t("ds-err-msg"), error);
      }
    }
  }, [t]);

  return (
    <section ref={containerRef} id="destinations" className="py-20 px-4 section-gray">
      {containerInView && (
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t("ds-header")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("ds-line")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 left-2 right-2">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="bg-emerald-500 border-2 [border-color:oklch(0.4771_0.0777_205.67)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => navigate(`/destinations/${destination.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div
                    className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <Camera className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-white">
                      {destination.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-sm font-medium text-white">
                      {destination.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground text-white">
                    {destination.name}
                  </h3>
                  <p className="text-muted-foreground text-white/80 mb-4 text-sm">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{t("ds-price")}</span>
                    <span className="text-lg font-semibold text-primary text-white">
                      {destination.price}
                    </span>
                
                  </div>
                    <div className="mt-4"></div>
                      <Link to={`/destinations/${destination.id}`} className="text-sm text-primary text-white hover:underline flex items-center">
                      {t("ds-detail")}
                      <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
            
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={() => navigate("/destinations")}
              variant="outline"
              className="cursor-pointer btn-outline px-6 md:px-8 py-3 text-base md:text-lg"
            >
              {user ? t("ds-button-1") : t("ds-button-2")}
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
