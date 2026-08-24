import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from "@/components/theme/theme-provider";
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, MapPin, CreditCard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toogle';
import { Footer } from '@/components/layouts/footer';
import type { UserData } from '@/types/userData';
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"

export default function BookingPenginapanPage() {
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

  const [penginapan, setPenginapan] = useState<any>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [jumlahKamar, setJumlahKamar] = useState(1);
  const [totalHarga, setTotalHarga] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch data penginapan
  useEffect(() => {
    const fetchPenginapan = async () => {
      try {
        const res = await fetch(`${API_URL}/penginapan/${id}`);
        if (!res.ok) throw new Error(t("bp-err-msg-1"));
        const data = await res.json();
        setPenginapan(data);
      } catch (e: any) {
        setError(e.message || t("bp-err-msg-2"));
      }
    };
    if (id) fetchPenginapan();
  }, [id, API_URL, t]);

  // Hitung total harga
  useEffect(() => {
    if (penginapan && checkIn && checkOut && jumlahKamar > 0) {
      const nights = Math.ceil(
        (+new Date(checkOut) - +new Date(checkIn)) / (1000 * 60 * 60 * 24)
      );
      setTotalHarga(nights * penginapan.hargaPerMalam * jumlahKamar);
    }
  }, [penginapan, checkIn, checkOut, jumlahKamar]);

  const handleBooking = async () => {
    try {
      setError('');
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) throw new Error(t("bp-err-msg-3"));

      const res = await fetch(`${API_URL}/booking/penginapan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          penginapan: id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          jumlah_kamar: jumlahKamar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("bp-err-msg-4"));
      }

      if (data.payment?.redirect_url) {
        // Redirect ke Midtrans
        window.location.href = data.payment.redirect_url;
      } else {
        alert(t("bp-err-msg-5"));
        // console.log('Booking data:', data.booking);
      }
    } catch (e: any) {
      setError(e.message || t("bp-err-msg-6"));
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
              <ArrowLeft className="w-4 h-4" /> {t("bp-back-btn")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("bp-header")}</h1>
              <p className="text-muted-foreground">{t("bp-line")}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {penginapan ? (
            <>
              {/* Penginapan Info */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500 dark:bg-emerald-900 rounded-lg">
                    <Home className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("bp-info")}</h2>
                    <p className="text-sm text-muted-foreground">{t("bp-info-p")}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {penginapan.gambar && (
                    <div className="md:w-1/3">
                      <img 
                        src={penginapan.gambar} 
                        alt={penginapan.nama}
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{penginapan.nama}</h3>
                    {penginapan.alamat && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{penginapan.alamat}</span>
                      </div>
                    )}
                    <div className={`${theme === "light" ? "bg-emerald-500" : "bg-emerald-900/30"} border border-emerald-200 dark:border-emerald-700 p-3 rounded-lg`}>
                      <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">
                        Rp {penginapan.hargaPerMalam?.toLocaleString()}
                      </span>
                      <span className="text-sm text-emerald-700 dark:text-emerald-300 ml-2">{t("bp-per-night")}</span>
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
                    <h2 className="text-lg font-semibold text-foreground">{t("bp-detail")}</h2>
                    <p className="text-sm text-muted-foreground">{t("bp-options")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">{t("bp-cin")}</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">{t("bp-cout")}</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground">{t("bp-room-total")}</label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        min={1}
                        max={penginapan.jumlahKamarTersedia}
                        value={jumlahKamar}
                        onChange={(e) => setJumlahKamar(+e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {penginapan.jumlahKamarTersedia} {t("bp-room")} {t("bp-available")}
                    </p>
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
                      <h2 className="text-lg font-semibold text-foreground">{t("bp-sum")}</h2>
                      <p className="text-sm text-muted-foreground">{t("bp-total-price")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("bp-price")}</span>
                      <span className="text-foreground">Rp {penginapan.hargaPerMalam?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("bp-night-total")}</span>
                      <span className="text-foreground">
                        {checkIn && checkOut ? Math.ceil((+new Date(checkOut) - +new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0} {t("bp-night")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("bp-room-sum")}</span>
                      <span className="text-foreground">{jumlahKamar} {t("bp-room")}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">{t("bp-price-sum")}</span>
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
                  disabled={loading || !checkIn || !checkOut || totalHarga === 0}
                  className="bg-emerald-500 hover:bg-emerald-500 text-white px-8 py-3"
                >
                  {loading ? t("bp-btn-1") : t("bp-btn-2")}
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
              <p className="text-muted-foreground">{t("bp-loading")}</p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
