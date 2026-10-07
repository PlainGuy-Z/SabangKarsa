import { PageIntro } from '@/components/experience/page-intro';
import { useCopy } from '@/components/experience/use-copy';

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
  const copy = useCopy();
  const { t } = useTranslation();

  useEffect(() => {
    setItems(strollData);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />

      {/* Hero Section */}
      <PageIntro title={copy("Singgah sebentar. Kenang lebih lama.", "Take a little detour.")} description={copy("Jelajahi tempat santai dan kuliner yang menemani harimu di Sabang.", "Explore places to unwind and local flavours for your days in Sabang.")} image="/assets/destinasi/destinations/sumur-tiga/pantaisumurtiga-1.webp" />

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