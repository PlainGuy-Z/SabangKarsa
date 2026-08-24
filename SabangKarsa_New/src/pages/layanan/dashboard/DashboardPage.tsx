import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SellerSidebar } from '../../../components/dashboardseller/SellerSidebar';
import { SellerHeader } from '../../../components/dashboardseller/SellerHeader';
import { SellerStatsCard } from '../../../components/dashboardseller/SellerStatsCard';
import { ServiceList } from '../../../components/dashboardseller/ServiceList';
import RentalForm from '../../../components/dashboardseller/RentalForm';
import TourGuideForm from '../../../components/dashboardseller/TourGuideForm';
import PenginapanForm from '../../../components/dashboardseller/PenginapanForm';
import { Car, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserData } from '@/types/userData';
import { useTranslation } from "react-i18next";
import axios, { AxiosError } from 'axios';
import "../../../i18n/i18n"

const API_URL = import.meta.env.VITE_API_URL;

export interface EditData {
  key: string;
  data: any;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!userData.id || userData.role !== "seller") {
    navigate(-1);
  }

  const token = localStorage.getItem('token');
  const [searchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editData, setEditData] = useState<EditData>({key: "", data: null});

  // Get current tab and form from URL params
  const currentTab = searchParams.get('tab') || 'dashboard';
  const currentForm = searchParams.get('form');

  const [user, setUser] = useState<{
    id: string; name: string; role: string; email: string; no_hp: string; alamat: string;
  } | null>(null);

  const [rentalList, setRentalList] = useState<any[]>([]);
  const [penginapanList, setPenginapanList] = useState<any[]>([]);
  const [tourguideList, setTourguideList] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed?.user || parsed);
      } catch (e) {
        console.error(t("db-err-msg-1"), e);
      }
    }
  }, [t]);

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        const [rentalRes, penginapanRes, tourguideRes] = await Promise.all([
          fetch(`${API_URL}/rental`).then(r => r.json()),
          fetch(`${API_URL}/penginapan`).then(r => r.json()),
          fetch(`${API_URL}/tourguides`).then(r => r.json()),
        ]);
        setRentalList(rentalRes);
        setPenginapanList(penginapanRes);
        setTourguideList(tourguideRes);
      } catch (e) {
        console.error(t("db-err-msg-2"), e);
      }
    };
    fetchAll();
  }, [token, t]);

  // Filter data berdasarkan user
  const userRentals = rentalList.filter(item => (item.penyedia?._id || item.penyedia) === user?.id);
  const userPenginapan = penginapanList.filter(item => (item.penyedia?._id || item.penyedia) === user?.id);
  const userTourguides = tourguideList.filter(item => (item.penyedia?._id || item.penyedia) === user?.id);

  // Handle edit
  const handleEdit = (type: 'rental' | 'penginapan' | 'tourguide', data: any) => {
    setEditData({
      key: type,
      data: data
    });
    // Redirect to form page
    navigate(`/layanan/dashboard?form=${type}`)
  };

  const handleDelete = async (type: 'rental' | 'penginapan' | 'tourguide', data: any) => {
    try {
      await axios.delete(`${API_URL}/${type === "tourguide" ? "tourguides" : type}/${data._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      window.location.reload();
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  }

  // Handle close form
  const handleCloseForm = () => {
    setEditData({key: "", data: null});
    navigate(`/layanan/dashboard`);
  };

  // Get page title and subtitle based on current tab/form
  const getPageInfo = () => {
    if (currentForm) {
      switch (currentForm) {
        case 'rental':
          return { title: editData ? t("db-rental-edit") : t("db-rental-add"), subtitle: t("db-rental-sub") };
        case 'penginapan':
          return { title: editData ? t("db-acc-edit") : t("db-acc-add"), subtitle: t("db-acc-sub") };
        case 'tourguide':
          return { title: editData ? t("db-tg-edit") : t("db-tg-add"), subtitle: t("db-tg-sub") };
        default:
          return { title: t("db-seller"), subtitle: t("db-seller-sub") };
      }
    }

    switch (currentTab) {
      case 'rental-saya':
        return { title: t("db-my-rental"), subtitle: t("db-my-rental-sub") };
      case 'penginapan-saya':
        return { title: t("db-my-acc"), subtitle: t("db-my-acc-sub") };
      case 'tourguide-saya':
        return { title: t("db-my-tg"), subtitle: t("db-my-tg-sub") };
      default:
        return { title: t("db-seller"), subtitle: t("db-seller-sub") };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex h-screen bg-admin">
      {/* Sidebar */}
      <SellerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <SellerHeader 
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          user={user}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Overview */}
          {!currentForm && currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SellerStatsCard
                  title={t("db-card-title-1")}
                  value={userRentals.length}
                  icon={Car}
                  color="blue"
                  description={t("db-card-desc")}
                  onClick={() => window.location.href = '/layanan/dashboard?tab=rental-saya'}
                />
                <SellerStatsCard
                  title={t("db-card-title-2")}
                  value={userPenginapan.length}
                  icon={Home}
                  color="purple"
                  description={t("db-card-desc")}
                  onClick={() => window.location.href = '/layanan/dashboard?tab=penginapan-saya'}
                />
                <SellerStatsCard
                  title={t("db-card-title-3")}
                  value={userTourguides.length}
                  icon={Users}
                  color="emerald"
                  description={t("db-card-desc")}
                  onClick={() => window.location.href = '/layanan/dashboard?tab=tourguide-saya'}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-admin-card rounded-lg border border-admin p-6">
                <h3 className="text-lg font-semibold text-admin mb-4">{t("db-add-h")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-admin rounded-lg cursor-pointer hover:bg-admin transition-colors"
                    onClick={() => window.location.href = '/layanan/dashboard?form=rental'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 text-white rounded-lg">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-admin">{t("db-rental-add-h")}</h4>
                        <p className="text-sm text-admin-muted">{t("db-rental-add-p")}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-admin rounded-lg cursor-pointer hover:bg-admin transition-colors"
                    onClick={() => window.location.href = '/layanan/dashboard?form=penginapan'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 text-white rounded-lg">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-admin">{t("db-acc-add-h")}</h4>
                        <p className="text-sm text-admin-muted">{t("db-acc-add-p")}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-admin rounded-lg cursor-pointer hover:bg-admin transition-colors"
                    onClick={() => window.location.href = '/layanan/dashboard?form=tourguide'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500 text-white rounded-lg">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-admin">{t("db-tg-add-h")}</h4>
                        <p className="text-sm text-admin-muted">{t("db-tg-add-p")}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* Rental Saya */}
          {!currentForm && currentTab === 'rental-saya' && (
            <ServiceList
              title={t("db-service-1")}
              services={userRentals}
              type="rental"
              onEdit={(service) => handleEdit('rental', service)}
              onDelete={(service) => handleDelete('rental', service)}
              setter={setEditData}
            />
          )}

          {/* Penginapan Saya */}
          {!currentForm && currentTab === 'penginapan-saya' && (
            <ServiceList
              title={t("db-service-2")}
              services={userPenginapan}
              type="penginapan"
              onEdit={(service) => handleEdit('penginapan', service)}
              onDelete={(service) => handleDelete('penginapan', service)}
              setter={setEditData}
            />
          )}

          {/* Tour Guide Saya */}
          {!currentForm && currentTab === 'tourguide-saya' && (
            <ServiceList
              title={t("db-service-3")}
              services={userTourguides}
              type="tourguide"
              onEdit={(service) => handleEdit('tourguide', service)}
              onDelete={(service) => handleDelete('tourguide', service)}
              setter={setEditData}
            />
          )}

          {/* Forms */}
          {currentForm && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-admin-card rounded-lg border border-admin overflow-hidden"
            >
              {currentForm === 'rental' && (
                <RentalForm 
                  token={token} 
                  user={user} 
                  setActiveForm={handleCloseForm} 
                  editData={editData} 
                  setter={setEditData}
                />
              )}
              {currentForm === 'tourguide' && (
                <TourGuideForm 
                  token={token} 
                  user={user} 
                  setActiveForm={handleCloseForm} 
                  editData={editData} 
                  setter={setEditData}
                />
              )}
              {currentForm === 'penginapan' && (
                <PenginapanForm 
                  token={token} 
                  user={user} 
                  setActiveForm={handleCloseForm} 
                  editData={editData} 
                  setter={setEditData}
                />
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
