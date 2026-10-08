import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n";
import "./footer.css";

export function Footer() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <footer className="sk-footer">
      {/* Background scenery image */}
      <div className="sk-footer-bg" aria-hidden="true">
        <img
          src="/assets/images/sabang-footer-sunset.png"
          alt=""
          loading="lazy"
        />
        <div className="sk-footer-bg-overlay" />
      </div>

      <div className="sk-footer-inner">
        {/* Main grid */}
        <div className="sk-footer-grid">
          {/* Brand column */}
          <div className="sk-footer-brand-col">
            <Link to="/" className="sk-footer-brand-link">
              <img
                src="/assets/images/SabangKarsa.png"
                alt="SabangKarsa Logo"
                className="sk-footer-logo"
              />
              <div>
                <span className="sk-footer-brand-name">SabangKarsa</span>
                <span className="sk-footer-brand-sub">SABANG, INDONESIA</span>
              </div>
            </Link>
            <p className="sk-footer-tagline">{t("footer-desc")}</p>
            <div className="sk-footer-socials">
              <a
                href="https://www.instagram.com/sabangkarsa?igsh=MWx5OThxamU2dXZwZw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="sk-footer-social-icon"
                aria-label="Instagram SabangKarsa"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Jelajahi column */}
          <div className="sk-footer-nav-col">
            <h3 className="sk-footer-nav-heading">
              {isEn ? "Explore" : "Jelajahi"}
            </h3>
            <ul className="sk-footer-nav-list">
              <li>
                <Link to="/destinations">
                  {isEn ? "Destinations" : "Destinasi"}
                </Link>
              </li>
              <li>
                <Link to="/informations">
                  {isEn ? "Travel Information" : "Informasi wisata"}
                </Link>
              </li>
              <li>
                <Link to="/about">
                  {isEn ? "About Us" : "Tentang kami"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan column */}
          <div className="sk-footer-nav-col">
            <h3 className="sk-footer-nav-heading">{t("footer-services")}</h3>
            <ul className="sk-footer-nav-list">
              <li>
                <Link to="/layanan/penginapan">
                  {isEn ? "Accommodation" : "Penginapan"}
                </Link>
              </li>
              <li>
                <Link to="/layanan/rental">
                  {isEn ? "Vehicle Rental" : "Rental kendaraan"}
                </Link>
              </li>
              <li>
                <Link to="/layanan/tourguide">
                  {isEn ? "Local Guide" : "Pemandu lokal"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Hubungi kami column */}
          <div className="sk-footer-nav-col">
            <h3 className="sk-footer-nav-heading">
              {isEn ? "Contact Us" : "Hubungi kami"}
            </h3>
            <ul className="sk-footer-contact-list">
              <li>
                <Mail size={16} aria-hidden="true" />
                <span>sabangkarsa@gmail.com</span>
              </li>
              <li>
                <MapPin size={16} aria-hidden="true" />
                <span>Sabang, Aceh, Indonesia</span>
              </li>
              <li>
                <Instagram size={16} aria-hidden="true" />
                <a
                  href="https://www.instagram.com/sabangkarsa?igsh=MWx5OThxamU2dXZwZw%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sk-footer-bottom">
          <p>
            © {new Date().getFullYear()} SabangKarsa.{" "}
            {isEn ? "All rights reserved." : "Semua hak dilindungi."}
          </p>
        </div>
      </div>
    </footer>
  );
}
