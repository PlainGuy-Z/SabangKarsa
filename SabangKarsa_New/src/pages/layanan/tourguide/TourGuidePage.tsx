import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {  Map, Search, Filter } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"

const API_URL = import.meta.env.VITE_API_URL;

interface TourGuide {
  _id: string;
  name: string;
  no_hp: string;
  instagram: string;
  kataKata: string;
  wilayah: string;
  harga: number;
  foto: string;
}


export default function TourGuidePage() {
  const [tourGuides, setTourGuides] = useState<TourGuide[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTourGuides = async () => {
      try {
        const res = await fetch(`${API_URL}/tourguides`);
        const data = await res.json();
        setTourGuides(data);
      } catch (err) {
        console.error(t("tg-err-msg"), err);
      } finally {
        setLoading(false);
      }
    };
    fetchTourGuides();
  }, [t]);

  const filteredTourGuides = tourGuides
    .filter((guide) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        guide.name.toLowerCase().includes(lowerSearch) ||
        guide.kataKata.toLowerCase().includes(lowerSearch) ||
        guide.wilayah.toLowerCase().includes(lowerSearch)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.harga - b.harga;
        case "price-high":
          return b.harga - a.harga;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="/assets/destinasi/pantaiiboih.webp" alt="Tour Guide Sabang" className="w-full h-full object-cover scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              {t("tg-header")}
            </motion.h1>
            <motion.p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("tg-line")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder={t("tg-search-ph")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="name">{t("tg-filter-1")}</option>
                <option value="price-low">{t("tg-filter-2")}</option>
                <option value="price-high">{t("tg-filter-3")}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">{t("tg-loading")}</div>
          ) : filteredTourGuides.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">{t("tg-not-found")}</h3>
              <p className="text-muted-foreground">{t("tg-suggest")}</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            >
              {filteredTourGuides.map((guide, idx) => (
                <motion.div
                  key={guide._id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={guide.foto} alt={guide.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm shadow">
                      {guide.wilayah}
                    </div>
                  </div>
                  <div className="p-6">
                    <a href={`/layanan/tour-guide/${guide._id}`} className="font-bold text-xl mb-2 hover:text-emerald-600 transition-colors no-underline cursor-pointer duration-200">{guide.name}</a>
                    <p className="text-muted-foreground text-sm mb-2">{guide.kataKata}</p>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Map className="w-4 h-4" /><span className="text-sm">{guide.wilayah}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-emerald-700">Rp {guide.harga.toLocaleString()}</span>
                        <div className="text-xs text-muted-foreground">{t("tg-per-day")}</div>
                      </div>
                      <Link to={`/layanan/tour-guide/${guide._id}`}>
                        <Button size="sm" className="cursor-pointer bg-emerald-500 hover:bg-emerald-500 text-white">
                          {t("tg-detail")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
