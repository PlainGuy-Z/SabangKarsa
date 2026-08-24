import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotFound } from "@/pages/NotFound";
import { Transition } from "@/pages/TransitionPage";
import type { UserData } from "@/types/userData";
import "../../../i18n/i18n"

const API_URL = import.meta.env.VITE_API_URL;

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
  const { t } = useTranslation();

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
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[50vh] overflow-hidden">
        <img src={guide.foto} alt={guide.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <motion.h1 className="text-3xl md:text-5xl font-bold mb-2">{guide.name}</motion.h1>
          <p className="text-lg">{guide.kataKata}</p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl shadow-xl p-6 border border-border"
        >
          <h2 className="text-2xl font-semibold mb-4 text-foreground">{t("dtg-detail")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-5 h-5" />
              {token ? (
                <span>{guide.no_hp}</span>
              ) : (
                <span>08**********</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Instagram className="w-5 h-5" />
              <span>{guide.instagram}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span>{guide.wilayah}</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-muted-foreground">{t("dtg-price")}</span>
            <div className="text-3xl font-bold text-emerald-700">Rp {guide.harga.toLocaleString()}</div>
          </div>

          <Button 
            disabled={(user.role !== "buyer" || guide.penyedia._id === user.id)}
            size="lg" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white" 
            onClick={() => navigate(`/tourguide/${guide._id}/booking`)}
          >
            {t("dtg-book-btn")}
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
