import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { useCopy } from "./use-copy";
export function ServiceDetailHero({
  title,
  image,
  subtitle,
  back,
  portrait = false,
}: {
  title: string;
  image: string;
  subtitle: string;
  back: string;
  portrait?: boolean;
}) {
  const copy = useCopy();
  return (
    <section
      id="main-content"
      className={`sk-detail-hero ${portrait ? "sk-detail-portrait" : ""}`}
    >
      <div className="sk-container">
        <Link to={back} className="sk-detail-back">
          <ArrowLeft size={14} />
          {copy("Kembali ke pilihan layanan", "Back to services")}
        </Link>
        <div className="sk-detail-heading">
          <div>
            <p className="sk-eyebrow">
              SABANGKARSA ·{" "}
              {copy("PILIHAN PERJALANANMU", "YOUR ISLAND JOURNEY")}
            </p>
            <h1>{title}</h1>
            <p>
              <MapPin size={15} />
              {subtitle}
            </p>
          </div>
          <span className="sk-detail-tag">
            {copy("Kenali sebelum memesan", "Get to know your choice")}
          </span>
        </div>
        <img className="sk-detail-photo" src={image} alt={title} />
      </div>
    </section>
  );
}
