import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  Users,
  Home,
  Plus,
  LogOut,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toogle';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface SellerSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function SellerSidebar({ isCollapsed, setIsCollapsed }: SellerSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current search params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'dashboard';
  const currentForm = searchParams.get('form');
  const { t } = useTranslation();
  const menuItems = [
    {
      id: 'dashboard',
      label: t("sells-label-1"),
      icon: LayoutDashboard,
      path: '/layanan/dashboard',
      active: true
    },
    {
      id: 'rental-saya',
      label: t("sells-label-2"),
      icon: Car,
      path: '/layanan/dashboard?tab=rental-saya',
      color: 'blue'
    },
    {
      id: 'penginapan-saya',
      label: t("sells-label-3"),
      icon: Home,
      path: '/layanan/dashboard?tab=penginapan-saya',
      color: 'purple'
    },
    {
      id: 'tourguide-saya',
      label: t("sells-label-4"),
      icon: Users,
      path: '/layanan/dashboard?tab=tourguide-saya',
      color: 'emerald'
    }
  ];

  const addMenuItems = [
    {
      id: 'tambah-rental',
      label: t("sells-label-5"),
      icon: Plus,
      path: '/layanan/dashboard?form=rental',
      color: 'blue'
    },
    {
      id: 'tambah-penginapan',
      label: t("sells-label-6"),
      icon: Plus,
      path: '/layanan/dashboard?form=penginapan',
      color: 'purple'
    },
    {
      id: 'tambah-tourguide',
      label: t("sells-label-7"),
      icon: Plus,
      path: '/layanan/dashboard?form=tourguide',
      color: 'emerald'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem("chatbot");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleMenuClick = (item: any) => {
    if (item.path) navigate(item.path);
  };

  // Function to check if menu item is active
  const isMenuActive = (item: any) => {
    if (item.id === 'dashboard') {
      return !currentForm && currentTab === 'dashboard';
    }
    if (item.id === 'rental-saya') {
      return !currentForm && currentTab === 'rental-saya';
    }
    if (item.id === 'penginapan-saya') {
      return !currentForm && currentTab === 'penginapan-saya';
    }
    if (item.id === 'tourguide-saya') {
      return !currentForm && currentTab === 'tourguide-saya';
    }
    return false;
  };

  // Function to check if add menu item is active
  const isAddMenuActive = (item: any) => {
    if (item.id === 'tambah-rental') {
      return currentForm === 'rental';
    }
    if (item.id === 'tambah-penginapan') {
      return currentForm === 'penginapan';
    }
    if (item.id === 'tambah-tourguide') {
      return currentForm === 'tourguide';
    }
    return false;
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-admin-card border-r border-admin flex flex-col"
    >
      {/* Header */}
      <div className="p-3 border-b border-admin">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-13 h-13">
                <img 
                  src="/assets/images/SabangKarsa.png" 
                  alt="SabangKarsa Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-admin">
                  {t("sells-header")}
                </h2>
                <p className="text-xs text-admin-muted">
                  {t("sells-line")}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-2">
          {/* Main Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item);
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-admin-muted hover:bg-admin hover:text-admin'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.button>
            );
          })}

          {/* Separator */}
          {!isCollapsed && (
            <div className="py-2">
              <hr className="border-admin" />
              <p className="text-xs text-admin-muted mt-2 px-3 font-medium">
                {t("sells-sep")}
              </p>
            </div>
          )}

          {/* Add Menu Items */}
          {addMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isAddMenuActive(item);
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-admin-muted hover:bg-admin hover:text-admin'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-admin space-y-3">
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-admin-muted">
              {t("sells-theme")}
            </span>
            <ThemeToggle />
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => navigate("/", { replace: true })}
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <ArrowLeft className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>{t("back-btn")}</span>}
        </Button>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>{t("sells-exit")}</span>}
        </Button>
      </div>
    </motion.div>
  );
}
