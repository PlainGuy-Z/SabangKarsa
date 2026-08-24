import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from "@/components/theme/theme-provider";
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Car, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toogle';
import { Footer } from '@/components/layouts/footer';
import type { UserData } from '@/types/userData';
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"

export default function BookingRentalPage() {
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  if (userData.role !== "buyer") {
    navigate(-1);
  }

  if (!userData.id) {
    navigate("/login");
  }

  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();

  const [rental, setRental] = useState<any>(null);
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [totalHarga, setTotalHarga] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data rental
  useEffect(() => {
    const fetchRental = async () => {
      try {
        const res = await fetch(`${API_URL}/rental/${id}`);
        if (!res.ok) throw new Error(t("br-err-msg-1"));
        const data = await res.json();
        setRental(data);
      } catch (e: any) {
        setError(e.message || t("br-err-msg-2"));
      }
    };
    if (id) fetchRental();
  }, [id, API_URL, t]);

  // Hitung total harga
  useEffect(() => {
    if (rental && tanggalMulai && tanggalSelesai) {
      const days = Math.ceil(
        (new Date(tanggalSelesai).getTime() - new Date(tanggalMulai).getTime())
        / (1000 * 60 * 60 * 24)
      );
      if (days > 0) {
        setTotalHarga(days * rental.harga);
      } else {
        setTotalHarga(0);
      }
    }
  }, [rental, tanggalMulai, tanggalSelesai]);

  const handleBooking = async () => {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error(t("br-err-msg-3"));

      const res = await fetch(`${API_URL}/booking/rental`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rental: id,
          tanggalMulai,
          tanggalSelesai,
          totalHarga, // opsional, BE sebaiknya hitung ulang
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("br-err-msg-4"));

      if (data.payment?.redirect_url) {
        // redirect ke Midtrans
        window.location.href = data.payment.redirect_url;
      } else {
        alert(t("br-err-msg-5"));
      }
    } catch (e: any) {
      setError(e.message || t("br-err-msg-6"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card bg-emerald-500 text-white dark:text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> {t("br-back-btn")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("br-header")}</h1>
              <p className="text-muted-foreground">{t("br-line")}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {rental ? (
            <>
              {/* Rental Info */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500 dark:bg-emerald-900 rounded-lg">
                    <Car className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("br-info")}</h2>
                    <p className="text-sm text-muted-foreground">{t("br-info-p")}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {rental.gambar && (
                    <div className="md:w-1/3">
                      <img 
                        src={rental.gambar} 
                        alt={rental.name}
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{rental.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{rental.deskripsi}</p>
                    <div className={`${theme === "light" ? "bg-emerald-500" : "bg-emerald-900/30"} border border-emerald-200 dark:border-emerald-700 p-3 rounded-lg`}>
                      <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">
                        Rp {rental.harga?.toLocaleString()}
                      </span>
                      <span className="text-sm text-emerald-700 dark:text-emerald-300 ml-2">{t("br-per-day")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500 dark:bg-emerald-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("br-detail")}</h2>
                    <p className="text-sm text-muted-foreground">{t("br-date-opt")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">{t("br-date-start")}</label>
                    <input
                      type="date"
                      value={tanggalMulai}
                      onChange={(e) => setTanggalMulai(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">{t("br-date-end")}</label>
                    <input
                      type="date"
                      value={tanggalSelesai}
                      onChange={(e) => setTanggalSelesai(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              {totalHarga > 0 && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500 dark:bg-emerald-900 rounded-lg">
                      <CreditCard className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{t("br-sum")}</h2>
                      <p className="text-sm text-muted-foreground">{t("br-price-total")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("br-price-per-day")}</span>
                      <span className="text-foreground">Rp {rental.harga?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("br-day-total")}</span>
                      <span className="text-foreground">
                        {tanggalMulai && tanggalSelesai ? Math.ceil((new Date(tanggalSelesai).getTime() - new Date(tanggalMulai).getTime()) / (1000 * 60 * 60 * 24)) : 0} {t("br-day")}
                      </span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">{t("br-price-sum")}</span>
                      <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        Rp {totalHarga.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleBooking} 
                  disabled={loading || !tanggalMulai || !tanggalSelesai || totalHarga === 0}
                  className="bg-emerald-500 hover:bg-emerald-500 text-white px-8 py-3"
                >
                  {loading ? t("br-btn-1") : t("br-btn-2")}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t("br-loading")}</p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
