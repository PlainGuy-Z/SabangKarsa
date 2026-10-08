import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CarFront, Phone, ArrowLeft, Shield } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/pages/NotFound";
import { Transition } from "@/pages/TransitionPage";
import type { UserData } from "@/types/userData";
import "../../../i18n/i18n";
import { API_URL } from "@/lib/api";
import "./DetailRentalPage.css";

interface Rental {
  _id: string;
  name: string;
  type: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  penyedia: {
    _id: string;
  }
  namaPenyedia: string;
  no_telepon: string;
  error: string;
}

export default function DetailRentalPage() {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}") as UserData;
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.toLowerCase().startsWith("en");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const res = await fetch(`${API_URL}/rental/${id}`);
        const data = await res.json();
        setRental(data);
      } catch (err) {
        console.error(t("dr-err-msg-1"), err);
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, [id, t]);

  if (loading) {
    return (
      <Transition message={t("dr-loading")} onComplete={() => navigate(`/layanan/rental/${id}`)} />
    );
  }

  if (!rental || rental.error) {
    return (
      <NotFound title="Data" message={t("dr-not-found")} buttonText={t("back-btn")} buttonRoute="/layanan/rental" />
    );
  }

  return (
    <div className="rdp-page">
      <Navbar />

      {/* Hero Image */}
      <section className="rdp-hero">
        <img
          src={rental.gambar}
          alt={rental.name}
          className="rdp-hero-img"
        />
        <div className="rdp-hero-overlay" />
        <div className="rdp-hero-content">
          <nav className="rdp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isEn ? "Home" : "Beranda"}</Link>
            <span>/</span>
            <Link to="/layanan/rental">{isEn ? "Vehicle Rental" : "Rental Kendaraan"}</Link>
            <span>/</span>
            <span>{rental.name}</span>
          </nav>
          <h1 className="rdp-hero-title">{rental.name}</h1>
          <div className="rdp-hero-meta">
            <CarFront size={15} />
            <span>{rental.type} · {t("dr-provider")}: {rental.namaPenyedia}</span>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="rdp-detail-section">
        <div className="rdp-container">
          <div className="rdp-layout">
            {/* Main Info */}
            <div className="rdp-main">
              {/* Back link */}
              <Link to="/layanan/rental" className="rdp-back-link">
                <ArrowLeft size={16} />
                {isEn ? "Back to vehicles" : "Kembali ke kendaraan"}
              </Link>

              {/* Description */}
              <div className="rdp-section-block">
                <h2 className="rdp-section-title">{t("dr-desc")}</h2>
                <p className="rdp-text">{rental.deskripsi}</p>
              </div>

            </div>

            {/* Sidebar */}
            <div className="rdp-sidebar">
              <div className="rdp-sidebar-card">

                <div className="rdp-sidebar-price">
                  <span className="rdp-sidebar-price-label">{t("dr-price")}</span>
                  <div className="rdp-sidebar-price-amount">
                    Rp {rental.harga.toLocaleString()} <span className="text-sm font-normal text-muted-foreground dark:text-gray-400">/ {t("dr-day")}</span>
                  </div>
                </div>

                <div className="rdp-sidebar-info">
                  <CarFront size={18} />
                  <span>{rental.type}</span>
                </div>
                
                <div className="rdp-sidebar-info">
                  <Shield size={18} />
                  <span>{rental.namaPenyedia}</span>
                </div>

                <div className="rdp-sidebar-contacts">
                  <div className="rdp-sidebar-info">
                    <Phone size={16} />
                    {token ? (
                      <a href={`tel:${rental.no_telepon}`} className="rdp-contact-link">
                        {rental.no_telepon || (isEn ? "No phone" : "Tidak ada nomor")}
                      </a>
                    ) : (
                      <span>08**********</span>
                    )}
                  </div>
                </div>

                <button
                  disabled={(user.role !== "buyer" || rental.penyedia._id === user.id)}
                  className="rdp-book-btn"
                  onClick={() => window.location.href = `/rental/${rental._id}/booking`}
                >
                  {t("dr-book-btn")}
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
