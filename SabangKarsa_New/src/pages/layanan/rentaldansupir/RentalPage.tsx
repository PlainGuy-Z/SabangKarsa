import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Filter, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"

const API_URL = import.meta.env.VITE_API_URL;

interface Rental {
  _id: string;
  name: string;
  type: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  penyedia: string;
  namaPenyedia: string;
  no_telepon: string;
}

export function RentalPage() {
  const { t } = useTranslation();
  const categories = [t("rpg-all"), t("rpg-cat-1"), t("rpg-cat-2"), t("rpg-cat-3")];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("rpg-all"));
  const [sortBy, setSortBy] = useState("name");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await fetch(`${API_URL}/rental`);
        const data = await res.json();
        setRentals(data);
      } catch (err) {
        console.error(t("rpg-err-msg-1"), err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, [t]);

  const filteredRental = rentals
    .filter((rental) => {
      const matchesSearch = rental.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === t("rpg-all") || rental.type === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
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

  const getCategory = (category: string) => {
    return category === t("rpg-cat-1") ? "Motor" : category === t("rpg-cat-2") ? "Mobil" : category === t("rpg-cat-3") ? "Mobil dengan Sopir" : t("rpg-all");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero section (tetap sama) */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="/assets/images/sectionhero.webp" alt="Rental Sabang" className="w-full h-full object-cover scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              {t("rpg-header")}
            </motion.h1>
            <motion.p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("rpg-line")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and filter */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="text" placeholder="Cari kendaraan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button key={category} onClick={() => {
                setSelectedCategory(getCategory(category));
              }}
                className={`px-4 py-2 rounded-full text-sm ${selectedCategory === (getCategory(category)) ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20" }`}>
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground">
              <option value="name">{t("rpg-filter-1")}</option>
              <option value="price-low">{t("rpg-filter-2")}</option>
              <option value="price-high">{t("rpg-filter-3")}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Rental Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center text-muted-foreground">{t("rpg-loading")}</div>
          ) : filteredRental.length === 0 ? (
            <div className="text-center text-muted-foreground">{t("rpg-not-found")}</div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRental.map((rental) => (
                <div key={rental._id} className="bg-card border rounded-2xl overflow-hidden shadow hover:-translate-y-2 transition">
                  <img src={rental.gambar} alt={rental.name} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <a href={`/layanan/rental/${rental._id}`} className="font-bold text-xl mb-2 hover:text-emerald-600 transition-colors no-underline cursor-pointer duration-200">{rental.name}</a>
                    <p className="text-muted-foreground text-sm mb-2">{rental.deskripsi}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-emerald-700 font-bold">Rp {rental.harga.toLocaleString()}</span>
                      <Link to={`/layanan/rental/${rental._id}`}>
                        <Button size="sm" className="cursor-pointer bg-emerald-500 text-white">{t("rpg-detail")}</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
