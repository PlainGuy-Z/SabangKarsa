import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, Home, User, Calendar, MapPin, CreditCard, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toogle';
import { Footer } from '@/components/layouts/footer';
import { useNavigate } from 'react-router-dom';
import type { UserData } from '@/types/userData';
import { useTranslation } from "react-i18next";
import "../../../i18n/i18n"

const API_URL = import.meta.env.VITE_API_URL;

// Interfaces
interface ResItem {
  _id: string;
  nama: string;
  name: string;
}

interface BookingRental {
  _id: string;
  rental: string | ResItem;
  tanggalMulai: string;
  tanggalSelesai: string;
  totalHarga: number;
  status_pembayaran: string;
}

interface BookingPenginapan {
  _id: string;
  penginapan: string | ResItem;
  check_in_date: string;
  check_out_date: string;
  jumlah_kamar: number;
  total_harga: number;
  status_pembayaran: string;
}

interface BookingTourGuide {
  _id: string;
  tourGuide: string | ResItem;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasiJemput: string;
  totalHarga: number;
  status_pembayaran: string;
}

export default function PesananPage() {
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  const { t } = useTranslation();
  
  if (!userData.id || userData.role !== "buyer") {
    navigate(-1);
  }

  const [rentalBookings, setRentalBookings] = useState<BookingRental[]>([]);
  const [penginapanBookings, setPenginapanBookings] = useState<BookingPenginapan[]>([]);
  const [tourGuideBookings, setTourGuideBookings] = useState<BookingTourGuide[]>([]);
  const [activeTab, setActiveTab] = useState<'rental' | 'penginapan' | 'tourguide'>('rental');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError(t("book-err-msg-1"));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rentalRes, penginapanRes, tourguideRes] = await Promise.all([
          fetch(`${API_URL}/booking/rental/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),

          fetch(`${API_URL}/booking/penginapan`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),

          fetch(`${API_URL}/booking/tour-guide/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
        ]);

        setRentalBookings(Array.isArray(rentalRes) ? rentalRes : []);
        setPenginapanBookings(Array.isArray(penginapanRes) ? penginapanRes : []);
        setTourGuideBookings(Array.isArray(tourguideRes) ? tourguideRes : []);

        // console.log(rentalRes);
        // console.log(penginapanRes);
        // console.log(tourguideRes);
      } catch (err) {
        console.error(t("book-err-msg-2"), err);
        setError(t("book-err-msg-3"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, t]);

  // helper function
  const renderItemName = (item: string | { nama: string; name: string }) =>
    typeof item === 'string' ? item : item.nama || item.name;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'settlement':
      case 'capture':
        return 'bg-emerald-500 text-white shadow-md';
      case 'pending':
        return 'bg-amber-500 text-white shadow-md';
      case 'expire':
      case 'cancel':
      case 'deny':
        return 'bg-red-500 text-white shadow-md';
      default:
        return 'bg-gray-500 text-white shadow-md';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'settlement':
      case 'capture':
        return t("usrbook-status-1");
      case 'pending':
        return t("usrbook-status-2");
      case 'expire':
        return t("usrbook-status-3");
      case 'cancel':
        return t("usrbook-status-4");
      case 'deny':
        return t("usrbook-status-5");
      default:
        return status || t("usrbook-status-6");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card bg-emerald-500 text-white dark:text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> {t("book-back-btn")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("book-header")}</h1>
              <p className="text-muted-foreground">{t("book-line")}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t("book-loading")}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500 rounded-lg shadow-md">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("book-cat-h")}</h2>
                    <p className="text-sm text-muted-foreground">{t("book-cat-p")}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('rental')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === 'rental'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-emerald-500 hover:text-emerald-600 dark:hover:bg-emerald-900/20'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    {t("book-rental-btn")}
                  </button>
                  <button
                    onClick={() => setActiveTab('penginapan')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === 'penginapan'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-emerald-500 hover:text-emerald-600 dark:hover:bg-emerald-900/20'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    {t("book-acc-btn")}
                  </button>
                  <button
                    onClick={() => setActiveTab('tourguide')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === 'tourguide'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-emerald-500 hover:text-emerald-600 dark:hover:bg-emerald-900/20'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    {t("book-tg-btn")}
                  </button>
                </div>
              </div>

              {/* Rental Bookings */}
              {activeTab === 'rental' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Car className="w-5 h-5 text-emerald-700" />
                    {t("book-rental-h")}
                  </h3>
                  {rentalBookings.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg border border-border">
                      <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t("book-rental-p")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {rentalBookings.map((booking) => (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-emerald-500 rounded-lg shadow-md">
                                <Car className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{renderItemName(booking.rental)}</h4>
                                <p className="text-sm text-muted-foreground">{t("book-rental-ch-p")}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status_pembayaran)}`}>
                              {getStatusText(booking.status_pembayaran)}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-rental-periode")}</span>
                              <span className="text-foreground">
                                {new Date(booking.tanggalMulai).toLocaleDateString()} - {new Date(booking.tanggalSelesai).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-rental-total")}</span>
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                Rp {booking.totalHarga.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Penginapan Bookings */}
              {activeTab === 'penginapan' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Home className="w-5 h-5 text-emerald-700" />
                    {t("book-acc-h")}
                  </h3>
                  {penginapanBookings.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg border border-border">
                      <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t("book-acc-p")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {penginapanBookings.map((booking) => (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-emerald-500 rounded-lg shadow-md">
                                <Home className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{renderItemName(booking.penginapan)}</h4>
                                <p className="text-sm text-muted-foreground">{t("book-acc-ch-p")}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status_pembayaran)}`}>
                              {getStatusText(booking.status_pembayaran)}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-acc-cin")}</span>
                              <span className="text-foreground">{new Date(booking.check_in_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-acc-cout")}</span>
                              <span className="text-foreground">{new Date(booking.check_out_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Home className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-acc-room")}</span>
                              <span className="text-foreground">{booking.jumlah_kamar} {t("book-acc-room-w")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-acc-total")}</span>
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                Rp {booking.total_harga.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tour Guide Bookings */}
              {activeTab === 'tourguide' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-700" />
                    {t("book-tg-h")}
                  </h3>
                  {tourGuideBookings.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg border border-border">
                      <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t("book-tg-p")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {tourGuideBookings.map((booking) => (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-emerald-500 rounded-lg shadow-md">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{renderItemName(booking.tourGuide)}</h4>
                                <p className="text-sm text-muted-foreground">{t("book-tg-ch-p")}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status_pembayaran)}`}>
                              {getStatusText(booking.status_pembayaran)}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-tg-periode")}</span>
                              <span className="text-foreground">
                                {new Date(booking.tanggalMulai).toLocaleDateString()} - {new Date(booking.tanggalSelesai).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-tg-loc")}</span>
                              <span className="text-foreground">{booking.lokasiJemput}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("book-tg-total")}</span>
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                Rp {booking.totalHarga.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
