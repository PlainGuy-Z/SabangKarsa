import { Link } from "react-router-dom";
import { useCopy } from "./use-copy";
export function PageIntro({
  title,
  description,
  image,
  eyebrow,
}: {
  title: string;
  description: string;
  image: string;
  eyebrow?: string;
}) {
  const copy = useCopy();
  return (
    <section id="main-content" tabIndex={-1} className="sk-page-intro">
      <div className="sk-container">
        <div>
          <div className="sk-breadcrumb">
            <Link to="/">{copy("Beranda", "Home")}</Link>
            <span>/</span>
            <span>{eyebrow || copy("Jelajahi Sabang", "Explore Sabang")}</span>
          </div>
          <p className="sk-eyebrow">
            {eyebrow || "SABANGKARSA · ISLAND JOURNAL"}
          </p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <img src={image} alt="" />
      </div>
    </section>
  );
}
