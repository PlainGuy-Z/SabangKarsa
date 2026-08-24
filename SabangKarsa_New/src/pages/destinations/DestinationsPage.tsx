import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme/theme-provider";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Star, Camera, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import data from "../../data/destinations.json";
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

const allDestinations: Destination[] = localStorage.getItem("language")?.toLowerCase() === "id" ? data.id : data.en;
const ITEMS_PER_PAGE = 9;

export function DestinationsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("destpg-all"));
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  // Get unique categories from destinations
  const categories = [t("destpg-all"), ...Array.from(new Set(allDestinations.map(dest => dest.category)))];

  // Filter and sort destinations
  const filteredDestinations = allDestinations
    .filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           destination.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === t("destpg-all") || destination.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDestinations = filteredDestinations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/destinasi/pantaiiboih.webp"
            alt="Destinasi Sabang"
            className="w-full h-full object-cover scale-110"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t("destpg-h-1")} <span className="text-emerald-800">{t("destpg-h-2")}</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t("destpg-line")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder={t("destpg-ph")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-emerald-500 text-white shadow-lg scale-105"
                      : "bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="name">{t("destpg-filter-1")}</option>
                <option value="rating">{t("destpg-filter-2")}</option>
                <option value="category">{t("destpg-filter-3")}</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="mb-8 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {searchTerm || selectedCategory !== t("destpg-all") 
                ? `${t("destpg-result")} (${filteredDestinations.length})`
                : `${t("destpg-all-res")} (${allDestinations.length})`
              }
            </h2>
            <div className="text-muted-foreground">
              {t("destpg-page-1")} {currentPage} {t("destpg-page-2")} {totalPages}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-2xl transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => navigate(`/destinations/${destination.id}`)}
              >
                <div className="relative h-56 overflow-hidden">
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
                    className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <Camera className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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
                  <a href={`/destinations/${destination.id}`} className={`text-xl font-bold mb-3 text-foreground ${theme === "light" ? "hover:text-emerald-600" : "hover:text-emerald-300"} transition-colors no-underline cursor-pointer duration-200`}>
                    {destination.name}
                  </a>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex flex-col">
                      <span className="text-2xl font-bold text-emerald-700">{destination.price}</span>
                      <span className="text-xs text-muted-foreground">{t("destpg-price")}</span>
                    </span>
                    <Button
                      size="sm"
                      className="bg-emerald-500 cursor-pointer hover:bg-emerald-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/destinations/${destination.id}`);
                      }}
                    >
                      {t("destpg-detail")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🏝️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t("destpg-not-found")}
              </h3>
              <p className="text-muted-foreground">
                {t("destpg-suggest")}
              </p>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex justify-center items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("destpg-prev")}
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={
                        page === currentPage
                          ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                {t("destpg-next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Page Info */}
          {filteredDestinations.length > 0 && (
            <motion.div
              className="text-center mt-6 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t("destpg-shown-1")} {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredDestinations.length)} {t("destpg-page-2")}{" "}
              {filteredDestinations.length} {t("destpg-shown-2")}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
