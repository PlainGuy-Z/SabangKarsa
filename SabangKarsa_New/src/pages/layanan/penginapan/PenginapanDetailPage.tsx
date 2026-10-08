import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail, BedDouble, Landmark, ArrowLeft, Clock, Shield } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/pages/NotFound";
import { Transition } from "@/pages/TransitionPage";
import type { UserData } from "@/types/userData";
import "../../../i18n/i18n";
import { API_URL } from "@/lib/api";
import "./PenginapanDetailPage.css";

export default function PenginapanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [penginapan, setPenginapan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const localStorageKey = `rated_penginapan_${id}`;
  const user = JSON.parse(localStorage.getItem("user") || "{}") as UserData;
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.toLowerCase().startsWith("en");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/penginapan/${id}`);
        const data = await res.json();

        setPenginapan(data);
      } catch (error) {
        console.error(t("pd-err-msg-1"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();

    // Cek kalau user sudah pernah kasih rating
    if (localStorage.getItem(localStorageKey)) {
      setHasRated(true);
    }
  }, [id, localStorageKey, t]);

  const handleSubmitRating = async () => {
    if (!userRating) return;

    try {
      // Get the token from localStorage or wherever you store it
      const token = localStorage.getItem('token');
      
      await fetch(`${API_URL}/penginapan/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ add_review: { rating: userRating } })
      });
      localStorage.setItem(localStorageKey, "true"); // supaya hanya sekali

      setHasRated(true);
      alert(t("pd-thanks"));
      
      // refresh data
      const res = await fetch(`${API_URL}/penginapan/${id}`);
      const data = await res.json();

      setPenginapan(data);
    } catch (error) {
      console.error(`${t("pd-err-msg-2")}:`, error);
      alert(t("pd-err-msg-2"));
    }
  };

  if (loading) {
    return (
      <Transition message={t("pd-loading")} onComplete={() => navigate(`/layanan/penginapan/${id}`)} />
    );
  }

  if (penginapan.error) {
    return (
      <NotFound title="Data" message={t("pd-not-found")} buttonText={t("back-btn")} buttonRoute="/layanan/penginapan" />
    );
  }

  return (
    <div className="pdp-page">
      <Navbar />

      {/* Hero Image */}
      <section className="pdp-hero">
        <img
          src={penginapan.gambar}
          alt={penginapan.nama}
          className="pdp-hero-img"
        />
        <div className="pdp-hero-overlay" />
        <div className="pdp-hero-content">
          <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isEn ? "Home" : "Beranda"}</Link>
            <span>/</span>
            <Link to="/layanan/penginapan">{isEn ? "Accommodation" : "Penginapan"}</Link>
            <span>/</span>
            <span>{penginapan.nama}</span>
          </nav>
          <h1 className="pdp-hero-title">{penginapan.nama}</h1>
          <div className="pdp-hero-meta">
            <MapPin size={15} />
            <span>{penginapan.lokasi} · {penginapan.tipePeningapan}</span>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="pdp-detail-section">
        <div className="pdp-container">
          <div className="pdp-layout">
            {/* Main Info */}
            <div className="pdp-main">
              {/* Back link */}
              <Link to="/layanan/penginapan" className="pdp-back-link">
                <ArrowLeft size={16} />
                {isEn ? "Back to accommodations" : "Kembali ke penginapan"}
              </Link>

              {/* Description */}
              <div className="pdp-section-block">
                <h2 className="pdp-section-title">{t("pd-desc")}</h2>
                <p className="pdp-text">{penginapan.deskripsi}</p>
              </div>

              {/* Facilities */}
              <div className="pdp-section-block">
                <h2 className="pdp-section-title">{t("pd-fasility")}</h2>
                <div className="pdp-facilities-grid">
                  {penginapan.fasilitas.map((f: string, idx: number) => (
                    <span key={idx} className="pdp-facility-tag">{f}</span>
                  ))}
                </div>
              </div>

              {/* Kebijakan */}
              <div className="pdp-section-block">
                <h2 className="pdp-section-title">
                  <Shield size={18} />
                  {t("pd-policy")}
                </h2>
                <p className="pdp-text">
                  {penginapan.kebijakan || t("pd-no-policy")}
                </p>
              </div>

              {/* Check In / Out */}
              <div className="pdp-time-grid">
                <div className="pdp-time-card">
                  <Clock size={18} className="pdp-time-icon" />
                  <div className="pdp-time-label">{t("pd-cin")}</div>
                  <div className="pdp-time-value">{penginapan.check_in_time}</div>
                </div>
                <div className="pdp-time-card">
                  <Clock size={18} className="pdp-time-icon" />
                  <div className="pdp-time-label">{t("pd-cout")}</div>
                  <div className="pdp-time-value">{penginapan.check_out_time}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="pdp-section-block">
                <h2 className="pdp-section-title">{t("pd-rating")}</h2>
                {hasRated ? (
                  <p className="pdp-text">{t("pd-rate-done")}</p>
                ) : (
                  <div className="pdp-rating-row">
                    {[1,2,3,4,5].map(num => (
                      <Star
                        key={num}
                        className={`pdp-star ${(user.role !== "buyer" || penginapan.penyedia._id === user.id) ? "pdp-star--disabled" : ""} ${userRating >= num ? "pdp-star--active" : ""}`}
                        onClick={() => {
                          if (user.role === "buyer" && penginapan.penyedia._id !== user.id) {
                            setUserRating(num);
                          }
                        }}
                      />
                    ))}
                    <button
                      disabled={userRating === 0 || (user.role !== "buyer" || penginapan.penyedia._id === user.id)}
                      onClick={handleSubmitRating}
                      className="pdp-submit-btn"
                    >
                      {t("pd-send-btn")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="pdp-sidebar">
              <div className="pdp-sidebar-card">
                <div className="pdp-sidebar-rating">
                  <div className="pdp-sidebar-rating-left">
                    <Star size={18} className="pdp-sidebar-star" />
                    <span className="pdp-sidebar-rating-num">{penginapan.rating || 0}</span>
                  </div>
                  <span className="pdp-sidebar-reviews">
                    {penginapan.jumlah_review} {t("pd-review")}
                  </span>
                </div>

                <div className="pdp-sidebar-price">
                  <span className="pdp-sidebar-price-label">{t("pd-price")}</span>
                  <div className="pdp-sidebar-price-amount">
                    Rp {penginapan.hargaPerMalam.toLocaleString()}
                  </div>
                </div>

                <div className="pdp-sidebar-info">
                  <BedDouble size={18} />
                  <span>{penginapan.jumlahKamarTersedia} {t("pd-room")}</span>
                </div>

                <div className="pdp-sidebar-info">
                  <Landmark size={18} />
                  <span>{penginapan.alamat}</span>
                </div>

                <div className="pdp-sidebar-contacts">
                  <div className="pdp-sidebar-info">
                    <Phone size={16} />
                    {token ? (
                      <a href={`tel:${penginapan.no_telepon}`} className="pdp-contact-link">
                        {penginapan.no_telepon || t("pd-no-phone")}
                      </a>
                    ) : (
                      <span>08**********</span>
                    )}
                  </div>
                  <div className="pdp-sidebar-info">
                    <Mail size={16} />
                    {token ? (
                      <a href={`mailto:${penginapan.email}`} className="pdp-contact-link">
                        {penginapan.email || t("pd-no-email")}
                      </a>
                    ) : (
                      <span>{penginapan.email ? "********@gmail.com" : t("pd-no-email")}</span>
                    )}
                  </div>
                </div>

                <button
                  disabled={(user.role !== "buyer" || penginapan.penyedia._id === user.id)}
                  className="pdp-book-btn"
                  onClick={() => window.location.href = `/penginapan/${id}/booking`}
                >
                  {t("pd-book-btn")}
                </button>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="pdp-map-section">
            <h2 className="pdp-section-title">{t("pd-loc")}</h2>
            {penginapan.lokasi_maps && penginapan.lokasi_maps !== "not yet" ? (
              <iframe
                src={`https://www.google.com/maps?q=${penginapan.nama}&output=embed`}
                className="pdp-map-iframe"
                allowFullScreen
                loading="lazy"
              ></iframe>
            ) : (
              <p className="pdp-text">{t("pd-no-loc")}</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
