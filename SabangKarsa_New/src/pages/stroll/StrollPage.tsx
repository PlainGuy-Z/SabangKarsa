
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin} from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import data from "../../data/stroll.json";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface StrollItem {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  category: string;
}

const strollData: StrollItem[] = localStorage.getItem("language")?.toLowerCase() === "id" ? data.id : data.en;

export function StrollPage() {
  const [items, setItems] = useState<StrollItem[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setItems(strollData);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/destinasi/pantaiiboih.webp"
            alt="Stroll Background"
            className="w-full h-full object-cover scale-110 transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/assets/destinasi/pantaiiboih.webp";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 dark:from-black/90 dark:via-black/60 dark:to-black/30"></div>
        </div>
        <motion.div
          className="absolute bottom-8 left-4 md:left-8 right-4 md:right-8 z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative p-8 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/2 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/80 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {t("spg-header")}
              </h1>
              <p className="text-lg md:text-xl text-white/90 dark:text-white/80 max-w-2xl">
                {t("spg-line")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stroll Items Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("spg-list")}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="bg-card rounded-xl shadow-lg border border-border card-border-hover overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.id * 0.1 }}
              >
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/destinasi/pantaiiboih.webp";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <a href={`/stroll/${item.id}`} className="font-bold text-xl text-foreground mb-2 hover:text-emerald-600 transition-colors no-underline cursor-pointer duration-200">
                    {item.name}
                  </a>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                  <Link to={`/stroll/${item.id}`}>
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                      {t("spg-detail")}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}