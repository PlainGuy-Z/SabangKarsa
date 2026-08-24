import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toogle';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      active: true
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem("chatbot");
    navigate('/', {replace: true});
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
                  {t("admin-sb-header")}
                </h2>
                <p className="text-xs text-admin-muted">
                  {t("admin-sb-p")}
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
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || activeItem === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  if (item.path) navigate(item.path);
                }}
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
              {t("admin-sb-theme")}
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
          {!isCollapsed && <span>{t("admin-sb-exit")}</span>}
        </Button>
      </div>
    </motion.div>
  );
}
