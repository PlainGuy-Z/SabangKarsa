import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Search, ChevronDown, ArrowRight, Car, UserCheck, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n";
import { API_URL } from "@/lib/api";
import "./RentalPage.css";

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
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.toLowerCase().startsWith("en");

  const categories = [t("rpg-all"), t("rpg-cat-1"), t("rpg-cat-2"), t("rpg-cat-3")];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("rpg-all"));
  const [sortBy, setSortBy] = useState("name");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

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

  const getCategoryInternal = (cat: string) => {
    if (cat === t("rpg-cat-1")) return "motor";
    if (cat === t("rpg-cat-2")) return "mobil";
    if (cat === t("rpg-cat-3")) return "mobil dengan sopir";
    return t("rpg-all");
  };

  const filteredRental = rentals
    .filter((rental) => {
      const matchesSearch = rental.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rental.namaPenyedia && rental.namaPenyedia.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const categoryKey = getCategoryInternal(selectedCategory);
      const matchesCategory = selectedCategory === t("rpg-all") || rental.type.toLowerCase() === categoryKey;
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

  const visibleItems = filteredRental.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRental.length;

  return (
    <div className="rpg-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="rpg-hero" aria-label={isEn ? "Hero" : "Banner"}>
        <img
          src="/assets/images/sectionhero.webp"
          alt={isEn ? "Rental Sabang Hero" : "Hero Rental Sabang"}
          className="rpg-hero-img"
        />
        <div className="rpg-hero-overlay" />
        <div className="rpg-hero-content">
          <nav className="rpg-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isEn ? "Home" : "Beranda"}</Link>
            <span>/</span>
            <span>{isEn ? "Rental & Driver" : "Rental & Sopir"}</span>
          </nav>
          <h1 className="rpg-hero-title">{t("rpg-header")}</h1>
          <p className="rpg-hero-sub">{t("rpg-line")}</p>
        </div>
      </section>

      {/* ── Search + Filter ───────────────────────────────────── */}
      <section className="rpg-search-section">
        <div className="rpg-container">
          {/* Search bar */}
          <div className="rpg-search-bar">
            <Search size={18} className="rpg-search-icon" aria-hidden="true" />
            <input
              type="search"
              placeholder={isEn ? "Search vehicle or provider..." : "Cari kendaraan atau penyedia..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rpg-search-input"
            />
            <button className="rpg-search-btn" aria-label={isEn ? "Search" : "Cari"}>
              {isEn ? "Search" : "Cari"}
            </button>
          </div>

          {/* Category pills */}
          <div className="rpg-filters" role="group" aria-label={isEn ? "Filter by category" : "Filter kategori"}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setVisibleCount(6);
                }}
                className={`rpg-filter-pill${selectedCategory === category ? " rpg-filter-pill--active" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listing ───────────────────────────────────────────── */}
      <main className="rpg-listing-section">
        <div className="rpg-container">
          {/* Header row */}
          <div className="rpg-listing-header">
            <h2 className="rpg-listing-title">
              {isEn ? "Vehicle & Driver Options" : "Pilihan Rental & Sopir"}
            </h2>
            <div className="rpg-sort-wrapper">
              <label htmlFor="rpg-sort" className="rpg-sort-label">
                {isEn ? "Sort by:" : "Urutkan:"}
              </label>
              <div className="rpg-sort-select-wrap">
                <select
                  id="rpg-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rpg-sort-select"
                >
                  <option value="name">{t("rpg-filter-1")}</option>
                  <option value="price-low">{t("rpg-filter-2")}</option>
                  <option value="price-high">{t("rpg-filter-3")}</option>
                </select>
                <ChevronDown size={15} className="rpg-sort-chevron" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="rpg-state-msg">{t("rpg-loading")}</div>
          ) : filteredRental.length === 0 ? (
            <div className="rpg-state-msg">
              <p className="rpg-state-title">{t("rpg-not-found")}</p>
              <p className="rpg-state-sub">{isEn ? "Try changing your search terms or filters." : "Coba ubah katakunci pencarian atau filter Anda."}</p>
            </div>
          ) : (
            <>
              <div className="rpg-grid">
                {visibleItems.map((rental) => (
                  <article key={rental._id} className="rpg-card">
                    {/* Image */}
                    <div className="rpg-card-img-wrap">
                      <img
                        src={rental.gambar}
                        alt={rental.name}
                        className="rpg-card-img"
                        loading="lazy"
                      />
                      <span className="rpg-card-badge">{rental.type}</span>
                    </div>

                    {/* Body */}
                    <div className="rpg-card-body">
                      <h3 className="rpg-card-name">
                        <Link to={`/layanan/rental/${rental._id}`}>{rental.name}</Link>
                      </h3>
                      
                      <p className="rpg-card-desc">{rental.deskripsi}</p>

                      {rental.namaPenyedia && (
                        <div className="rpg-card-meta">
                          <UserCheck size={14} />
                          <span>{rental.namaPenyedia}</span>
                        </div>
                      )}

                      {/* Price + CTA */}
                      <div className="rpg-card-footer">
                        <div className="rpg-card-price">
                          <span className="rpg-card-price-amount">
                            Rp{rental.harga.toLocaleString("id-ID")}
                          </span>
                          <span className="rpg-card-price-unit">
                            / {isEn ? "day" : "hari"}
                          </span>
                        </div>
                        <Link to={`/layanan/rental/${rental._id}`} className="rpg-card-btn">
                          {isEn ? "See detail" : "Lihat detail"}
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="rpg-load-more-wrap">
                  <button
                    className="rpg-load-more-btn"
                    onClick={() => setVisibleCount((c) => c + 6)}
                  >
                    {isEn ? "See more options" : "Lihat pilihan lainnya"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

