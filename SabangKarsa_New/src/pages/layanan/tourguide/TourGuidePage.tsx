import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Search, ChevronDown, ArrowRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n";
import { API_URL } from "@/lib/api";
import "./TourGuidePage.css";

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
  const [visibleCount, setVisibleCount] = useState(6);
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.toLowerCase().startsWith("en");

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

  const visibleItems = filteredTourGuides.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTourGuides.length;

  return (
    <div className="tgp-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="tgp-hero" aria-label={isEn ? "Hero" : "Banner"}>
        <img
          src="/assets/destinasi/pantaiiboih.webp"
          alt={isEn ? "Tour Guide Sabang Hero" : "Hero Pemandu Wisata Sabang"}
          className="tgp-hero-img"
        />
        <div className="tgp-hero-overlay" />
        <div className="tgp-hero-content">
          <nav className="tgp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isEn ? "Home" : "Beranda"}</Link>
            <span>/</span>
            <span>{isEn ? "Tour Guide" : "Pemandu Wisata"}</span>
          </nav>
          <h1 className="tgp-hero-title">{t("tg-header")}</h1>
          <p className="tgp-hero-sub">{t("tg-line")}</p>
        </div>
      </section>

      {/* ── Search + Filter ───────────────────────────────────── */}
      <section className="tgp-search-section">
        <div className="tgp-container">
          {/* Search bar */}
          <div className="tgp-search-bar">
            <Search size={18} className="tgp-search-icon" aria-hidden="true" />
            <input
              type="search"
              placeholder={t("tg-search-ph")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tgp-search-input"
            />
            <button className="tgp-search-btn" aria-label={isEn ? "Search" : "Cari"}>
              {isEn ? "Search" : "Cari"}
            </button>
          </div>
        </div>
      </section>

      {/* ── Listing ───────────────────────────────────────────── */}
      <main className="tgp-listing-section">
        <div className="tgp-container">
          {/* Header row */}
          <div className="tgp-listing-header">
            <h2 className="tgp-listing-title">
              {isEn ? "Tour Guide Options" : "Pilihan Pemandu Wisata"}
            </h2>
            <div className="tgp-sort-wrapper">
              <label htmlFor="tgp-sort" className="tgp-sort-label">
                {isEn ? "Sort by:" : "Urutkan:"}
              </label>
              <div className="tgp-sort-select-wrap">
                <select
                  id="tgp-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="tgp-sort-select"
                >
                  <option value="name">{t("tg-filter-1")}</option>
                  <option value="price-low">{t("tg-filter-2")}</option>
                  <option value="price-high">{t("tg-filter-3")}</option>
                </select>
                <ChevronDown size={15} className="tgp-sort-chevron" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="tgp-state-msg">{t("tg-loading")}</div>
          ) : filteredTourGuides.length === 0 ? (
            <div className="tgp-state-msg">
              <p className="tgp-state-title">{t("tg-not-found")}</p>
              <p className="tgp-state-sub">{t("tg-suggest")}</p>
            </div>
          ) : (
            <>
              <div className="tgp-grid">
                {visibleItems.map((guide) => (
                  <article key={guide._id} className="tgp-card">
                    {/* Image */}
                    <div className="tgp-card-img-wrap">
                      <img
                        src={guide.foto}
                        alt={guide.name}
                        className="tgp-card-img"
                        loading="lazy"
                      />
                      <span className="tgp-card-badge">
                        <MapPin size={12} />
                        {guide.wilayah}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="tgp-card-body">
                      <h3 className="tgp-card-name">
                        <Link to={`/layanan/tour-guide/${guide._id}`}>{guide.name}</Link>
                      </h3>
                      <p className="tgp-card-desc">{guide.kataKata}</p>

                      {/* Price + CTA */}
                      <div className="tgp-card-footer">
                        <div className="tgp-card-price">
                          <span className="tgp-card-price-amount">
                            Rp{guide.harga.toLocaleString("id-ID")}
                          </span>
                          <span className="tgp-card-price-unit">
                            / {isEn ? "day" : "hari"}
                          </span>
                        </div>
                        <Link to={`/layanan/tour-guide/${guide._id}`} className="tgp-card-btn">
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
                <div className="tgp-load-more-wrap">
                  <button
                    className="tgp-load-more-btn"
                    onClick={() => setVisibleCount((c) => c + 6)}
                  >
                    {isEn ? "See more guides" : "Lihat pemandu lainnya"}
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

