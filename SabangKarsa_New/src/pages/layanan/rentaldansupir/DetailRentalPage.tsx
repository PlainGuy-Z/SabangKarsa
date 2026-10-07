import { ServiceDetailHero } from '@/components/experience/service-detail-hero';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import type { UserData } from "@/types/userData";
import { NotFound } from "@/pages/NotFound";

import "../../../i18n/i18n";
import { API_URL } from "@/lib/api";

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
  const { t } = useTranslation();

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
      <div role="status" className="sk-detail-loading">{t("dr-loading")}</div>
    );
  }

  if (!rental || rental.error) {
    return (
      <NotFound title="Data" message={t("dr-not-found")} buttonText={t("back-btn")} buttonRoute="/layanan/rental" />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <ServiceDetailHero title={rental.name} image={rental.gambar} subtitle={`${rental.type} · ${rental.namaPenyedia}`} back="/layanan/rental" />

      {/* Detail Section */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Deskripsi */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-2">{t("dr-desc")}</h2>
            <p className="text-muted-foreground">{rental.deskripsi}</p>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="font-medium text-muted-foreground mb-1">{t("dr-price")}</div>
              <div className="text-2xl font-bold text-emerald-700">
                Rp {rental.harga.toLocaleString()} / {t("dr-day")}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="font-medium text-muted-foreground mb-1">{t("dr-phone")}</div>
              {token ? (
                <a
                  href={`tel:${rental.no_telepon}`}
                  className="text-lg font-semibold text-emerald-700 hover:underline"
                >
                  {rental.no_telepon}
                </a>
              ) : (
                <p className="text-lg font-semibold text-emerald-700">
                  08**********
                </p>
              )}
            </div>
          </motion.div>

          {/* Tombol booking */}
          <div className="flex justify-center">
            <Button
              disabled={(user.role !== "buyer" || rental.penyedia._id === user.id)}
              size="lg"
              className="bg-emerald-500 text-white hover:bg-emerald-700 transition-colors duration-300"
              onClick={() => window.location.href = `/rental/${rental._id}/booking`}
            >
              {t("dr-book-btn")}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
