import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Phone, MapPin, Instagram, ArrowLeft, User } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/pages/NotFound";
import { Transition } from "@/pages/TransitionPage";
import type { UserData } from "@/types/userData";
import "../../../i18n/i18n";
import { API_URL } from "@/lib/api";
import "./DetailTourGuidePage.css";

interface TourGuide {
  _id: string;
  name: string;
  no_hp: string;
  instagram: string;
  kataKata: string;
  wilayah: string;
  penyedia: {
    _id: string;
  }
  harga: number;
  foto: string;
  error: string;
}

export default function DetailTourGuidePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<TourGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}") as UserData;
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.toLowerCase().startsWith("en");

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await fetch(`${API_URL}/tourguides/${id}`);
        const data = await res.json();
        setGuide(data);
      } catch (err) {
        console.error(t("dtg-err-msg"), err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id, t]);

  if (loading) {
    return (
      <Transition message={t("dtg-loading")} onComplete={() => navigate(`/layanan/tourguide/${id}`)} />
    );
  }

  if (!guide || guide.error) {
    return (
      <NotFound title="Data" message={t("dtg-not-found")} buttonText={t("back-btn")} buttonRoute="/layanan/tourguide" />
    );
  }

  return (
    <div className="tdp-page">
      <Navbar />

      {/* Hero Image */}
      <section className="tdp-hero">
        <img src={guide.foto} alt={guide.name} className="tdp-hero-img" />
        <div className="tdp-hero-overlay" />
        <div className="tdp-hero-content">
          <nav className="tdp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isEn ? "Home" : "Beranda"}</Link>
            <span>/</span>
            <Link to="/layanan/tourguide">{isEn ? "Local Guide" : "Pemandu Lokal"}</Link>
            <span>/</span>
            <span>{guide.name}</span>
          </nav>
          <h1 className="tdp-hero-title">{guide.name}</h1>
          <div className="tdp-hero-meta">
            <MapPin size={15} />
            <span>{guide.wilayah}</span>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="tdp-detail-section">
        <div className="tdp-container">
          <div className="tdp-layout">
            {/* Main Info */}
            <div className="tdp-main">
              {/* Back link */}
              <Link to="/layanan/tourguide" className="tdp-back-link">
                <ArrowLeft size={16} />
                {isEn ? "Back to guides" : "Kembali ke pemandu"}
              </Link>

              {/* Description */}
              <div className="tdp-section-block">
                <h2 className="tdp-section-title">{t("dtg-detail")}</h2>
                <p className="tdp-text">{guide.kataKata}</p>
              </div>

            </div>

            {/* Sidebar */}
            <div className="tdp-sidebar">
              <div className="tdp-sidebar-card">

                <div className="tdp-sidebar-price">
                  <span className="tdp-sidebar-price-label">{t("dtg-price")}</span>
                  <div className="tdp-sidebar-price-amount">
                    Rp {guide.harga.toLocaleString()}
                  </div>
                </div>

                <div className="tdp-sidebar-info">
                  <User size={18} />
                  <span>{guide.name}</span>
                </div>
                
                <div className="tdp-sidebar-info">
                  <MapPin size={18} />
                  <span>{guide.wilayah}</span>
                </div>

                <div className="tdp-sidebar-contacts">
                  <div className="tdp-sidebar-info">
                    <Phone size={16} />
                    {token ? (
                      <a href={`tel:${guide.no_hp}`} className="tdp-contact-link">
                        {guide.no_hp || (isEn ? "No phone" : "Tidak ada nomor")}
                      </a>
                    ) : (
                      <span>08**********</span>
                    )}
                  </div>
                  
                  <div className="tdp-sidebar-info">
                    <Instagram size={16} />
                    {guide.instagram ? (
                      <a href={`https://instagram.com/${guide.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="tdp-contact-link">
                        {guide.instagram}
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>

                <button
                  disabled={(user.role !== "buyer" || guide.penyedia._id === user.id)}
                  className="tdp-book-btn"
                  onClick={() => navigate(`/tourguide/${guide._id}/booking`)}
                >
                  {t("dtg-book-btn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
