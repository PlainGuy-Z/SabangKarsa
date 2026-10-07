import { Link } from "react-router-dom";
import { Compass, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
export function NotFound({
  title,
  message,
  buttonText,
  buttonRoute,
}: {
  title?: string;
  message?: string;
  buttonText?: string;
  buttonRoute?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="sk-container sk-not-found">
        <Compass size={36} strokeWidth={1} />
        <p className="sk-eyebrow">SABANGKARSA</p>
        <h1>
          {title || t("nf-page")} {t("nf-not-found")}
        </h1>
        <p>{message || t("nf-massage")}</p>
        <Link className="sk-button" to={buttonRoute || "/"}>
          {buttonText || t("nf-button")}
          <ArrowRight size={17} />
        </Link>
      </main>
      <Footer />
    </div>
  );
}
