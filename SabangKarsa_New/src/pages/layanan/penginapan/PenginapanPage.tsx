import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { MapPin, Search, Wifi, Wind, ParkingCircle, Waves, Coffee, Utensils, ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n";
import { API_URL } from "@/lib/api";
import "./PenginapanPage.css";

/* ── Facility icon map ─────────────────────────────────────── */
const FACILITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  "wi-fi": <Wifi size={14} />,
  ac: <Wind size={14} />,
  parkir: <ParkingCircle size={14} />,
  "akses pantai": <Waves size={14} />,
  sarapan: <Coffee size={14} />,
  restoran: <Utensils size={14} />,
};

function FacilityIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  const icon = Object.entries(FACILITY_ICONS).find(([k]) => key.includes(k))?.[1];
  return (
    <span className="ppg-facility">
      {icon ?? null}
      {label}
    </span>
  );
}

function capitalizeWords(text: string) {
  return text.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function PenginapanPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.toLowerCase().startsWith("en");

  const categories = [t("ppg-all"), "Hotel", "Resort", "Inn", "Homestay", "Guest House", "Boutique Hotel"];
  const [penginapanList, setPenginapanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("ppg-all"));
  const [sortBy, setSortBy] = useState("name");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchPenginapan = async () => {
      try {
        const res = await fetch(`${API_URL}/penginapan`);
        const data = await res.json();
        setPenginapanList(data);
      } catch (error) {
        console.error(t("ppg-err-msg-1"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchPenginapan();
  }, [t]);

  const filteredPenginapan = penginapanList
    .filter((p) => {
      const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === t("ppg-all") || capitalizeWords(p.tipePeningapan) === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.hargaPerMalam - b.hargaPerMalam;
        case "price-high": return b.hargaPerMalam - a.hargaPerMalam;
        case "rating": return b.rating - a.rating;
        default: return a.nama.localeCompare(b.nama);
      }
    });

  const visibleItems = filteredPenginapan.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPenginapan.length;

  return (
    <div className="ppg-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="ppg-hero" aria-label={isEn ? "Hero" : "Banner"}>
        <img
          src="/assets/destinasi/pantaiiboih.webp"
          alt={isEn ? "Iboih Beach aerial view" : "Pemandangan udara Pantai Iboih"}
          className="ppg-hero-img"
        />
        <div className="ppg-hero-overlay" />
        <div className="ppg-hero-content">
          <nav className="ppg-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isEn ? "Home" : "Beranda"}</Link>
            <span>/</span>
            <span>{isEn ? "Accommodation" : "Penginapan"}</span>
          </nav>
          <h1 className="ppg-hero-title">{t("ppg-header")}</h1>
          <p className="ppg-hero-sub">{t("ppg-line")}</p>
        </div>
      </section>

      {/* ── Search + Filter ───────────────────────────────────── */}
      <section className="ppg-search-section">
        <div className="ppg-container">
          {/* Search bar */}
          <div className="ppg-search-bar">
            <Search size={18} className="ppg-search-icon" aria-hidden="true" />
            <input
              type="search"
              id="ppg-search"
              placeholder={t("ppg-search-ph")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ppg-search-input"
            />
            <button className="ppg-search-btn" aria-label={isEn ? "Search" : "Cari"}>
              {isEn ? "Search" : "Cari"}
            </button>
          </div>

          {/* Category pills */}
          <div className="ppg-filters" role="group" aria-label={isEn ? "Filter by type" : "Filter berdasarkan tipe"}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(6); }}
                className={`ppg-filter-pill${selectedCategory === cat ? " ppg-filter-pill--active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listing ───────────────────────────────────────────── */}
      <main className="ppg-listing-section">
        <div className="ppg-container">
          {/* Header row */}
          <div className="ppg-listing-header">
            <h2 className="ppg-listing-title">
              {isEn ? "Accommodation options" : "Pilihan penginapan"}
            </h2>
            <div className="ppg-sort-wrapper">
              <label htmlFor="ppg-sort" className="ppg-sort-label">
                {isEn ? "Sort by:" : "Urutkan:"}
              </label>
              <div className="ppg-sort-select-wrap">
                <select
                  id="ppg-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ppg-sort-select"
                >
                  <option value="name">{t("ppg-filter-1")}</option>
                  <option value="price-low">{t("ppg-filter-2")}</option>
                  <option value="price-high">{t("ppg-filter-3")}</option>
                  <option value="rating">{t("ppg-filter-4")}</option>
                </select>
                <ChevronDown size={15} className="ppg-sort-chevron" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="ppg-state-msg">{t("ppg-loading")}</div>
          ) : filteredPenginapan.length === 0 ? (
            <div className="ppg-state-msg">
              <p className="ppg-state-title">{t("ppg-not-found")}</p>
              <p className="ppg-state-sub">{t("ppg-suggest")}</p>
            </div>
          ) : (
            <>
              <div className="ppg-grid">
                {visibleItems.map((p) => (
                  <article key={p._id} className="ppg-card">
                    {/* Image */}
                    <div className="ppg-card-img-wrap">
                      <img
                        src={p.gambar}
                        alt={p.nama}
                        className="ppg-card-img"
                        loading="lazy"
                      />
                      <span className="ppg-card-badge">{capitalizeWords(p.tipePeningapan)}</span>
                    </div>

                    {/* Body */}
                    <div className="ppg-card-body">
                      <h3 className="ppg-card-name">
                        <Link to={`/layanan/penginapan/${p._id}`}>{p.nama}</Link>
                      </h3>
                      <p className="ppg-card-location">
                        <MapPin size={13} aria-hidden="true" />
                        {p.lokasi}
                      </p>

                      {/* Facilities */}
                      <div className="ppg-card-facilities">
                        {p.fasilitas.slice(0, 3).map((f: string, i: number) => (
                          <FacilityIcon key={i} label={f} />
                        ))}
                        {p.fasilitas.length > 3 && (
                          <span className="ppg-facility ppg-facility--more">
                            +{p.fasilitas.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Price + CTA */}
                      <div className="ppg-card-footer">
                        <div className="ppg-card-price">
                          <span className="ppg-card-price-amount">
                            Rp{p.hargaPerMalam.toLocaleString("id-ID")}
                          </span>
                          <span className="ppg-card-price-unit">
                            / {isEn ? "night" : "malam"}
                          </span>
                        </div>
                        <Link to={`/layanan/penginapan/${p._id}`} className="ppg-card-btn">
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
                <div className="ppg-load-more-wrap">
                  <button
                    className="ppg-load-more-btn"
                    onClick={() => setVisibleCount((c) => c + 6)}
                  >
                    {isEn ? "See more accommodations" : "Lihat penginapan lainnya"}
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
