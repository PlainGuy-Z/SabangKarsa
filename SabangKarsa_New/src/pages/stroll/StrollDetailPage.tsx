import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Star,
  ArrowLeft,
  MapPin,
  X,
  Expand,
} from "lucide-react";
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
  gallery: string[];
  location: string;
  category: string;
  price: string;
  rating: number;
  detailDescription: string;
}

const strollData: StrollItem[] = localStorage.getItem("language")?.toLowerCase() === "id" ? data.id : data.en;

export function StrollDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<StrollItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      const foundItem = strollData.find((itm) => itm.id === parseInt(id));
      setItem(foundItem || null);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("sd-not-found")}
          </h2>
          <Button onClick={() => navigate("/stroll")}>
            {t("sd-back-btn")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={item.image}
            alt={item.name}
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
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/2 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl"></div>
            <div className="relative p-8 text-white">
              <motion.div
                className="flex items-center justify-between mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 bg-black/30 dark:bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-yellow-100 dark:text-yellow-200">
                      {item.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/80 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {item.name}
              </motion.h1>
              <motion.div
                className="flex flex-wrap items-center gap-4 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 dark:border-white/10">
                  <MapPin className="w-4 h-4 text-emerald-900" />
                  <span className="text-white/90 dark:text-white/80 font-medium">
                    {item.location}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Photo Gallery */}
              <div className="detail-box rounded-2xl p-6 md:p-8 shadow-lg mb-8">
                <div className="relative mb-6">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <img
                      src={item.gallery[currentImageIndex]}
                      alt={`${item.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setIsFullscreen(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/destinasi/pantaiiboih.webp";
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen(true);
                      }}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                    >
                      <Expand className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {item.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-200 ${
                        currentImageIndex === index
                          ? "ring-2 [--tw-ring-color:oklch(0.4771_0.0777_205.67)] scale-105"
                          : "hover:scale-105 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/destinasi/pantaiiboih.webp";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description and Details */}
              <div className="detail-box rounded-2xl p-6 md:p-8 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {item.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8">
                  {item.detailDescription}
                </p>
              </div>
            </motion.div>

            {/* Item Information */}
            <motion.div
              className="sticky top-24"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="detail-box rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t("sd-info")}
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("sd-category")}</span>
                    <span className="font-medium text-right">{item.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("sd-price")}</span>
                    <span className="font-semibold text-right text-emerald-700 dark:text-emerald-400 text-lg">
                      {item.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("sd-rating")}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-right">{item.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("sd-loc")}</span>
                    <span className="font-medium text-right">{item.location}</span>
                  </div>
                </div>
               
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            <img
              src={item.gallery[currentImageIndex]}
              alt={`${item.name} - Fullscreen`}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/assets/destinasi/pantaiiboih.webp";
              }}
            />
            {item.gallery.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? item.gallery.length - 1 : prev - 1
                    );
                  }}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === item.gallery.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
