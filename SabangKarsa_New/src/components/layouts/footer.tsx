import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram } from "lucide-react";
import { useCopy } from "@/components/experience/use-copy";
export function Footer() {
  const copy = useCopy();
  return (
    <footer className="sk-footer">
      <div className="sk-container">
        <div className="sk-footer-grid">
          <div className="sk-footer-about">
            <Link to="/" className="sk-brand">
              <img
                src="/assets/images/SabangKarsa.png"
                alt=""
                width="43"
                height="43"
              />
              <span>SabangKarsa</span>
            </Link>
            <p>
              {copy(
                "Teman perjalananmu untuk mengenal Sabang lebih dekat. Dari rencana pertama hingga cerita yang dibawa pulang.",
                "Your companion for getting to know Sabang. From the first plans to the stories you take home.",
              )}
            </p>
            <span className="sk-eyebrow">PULAU WEH, ACEH, INDONESIA</span>
          </div>
          <div>
            <h3>{copy("Rencanakan", "Plan your trip")}</h3>
            <Link to="/layanan/penginapan">
              {copy("Penginapan", "Accommodation")}
            </Link>
            <Link to="/layanan/rental">
              {copy("Sewa kendaraan", "Vehicle rental")}
            </Link>
            <Link to="/layanan/tourguide">
              {copy("Pemandu lokal", "Local guides")}
            </Link>
            <Link to="/informations">
              {copy("Panduan perjalanan", "Travel guide")}
            </Link>
          </div>
          <div>
            <h3>{copy("Temukan", "Explore")}</h3>
            <Link to="/destinations">{copy("Destinasi", "Destinations")}</Link>
            <Link to="/stroll">
              {copy("Jalan-jalan & kuliner", "Stroll & culinary")}
            </Link>
            <Link to="/agenda">{copy("Agenda lokal", "Local events")}</Link>
            <Link to="/about">{copy("Tentang kami", "About us")}</Link>
          </div>
          <div>
            <h3>{copy("Mari terhubung", "Say hello")}</h3>
            <a href="mailto:sabangkarsa@gmail.com">
              sabangkarsa@gmail.com
              <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.instagram.com/sabangkarsa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={15} /> Instagram
              <ArrowUpRight size={14} />
            </a>
            <p>
              {copy(
                "Ada pertanyaan tentang perjalananmu? Kirimkan pesan kepada kami.",
                "Questions about your visit? Drop us a message.",
              )}
            </p>
          </div>
        </div>
        <div className="sk-footer-bottom">
          <span>© {new Date().getFullYear()} SabangKarsa</span>
          <span>
            {copy(
              "Berangkat dengan rencana. Pulang membawa cerita.",
              "Arrive with a plan. Leave with a story.",
            )}
          </span>
          <a
            href="#navbar"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {copy("Kembali ke atas", "Back to top")} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
