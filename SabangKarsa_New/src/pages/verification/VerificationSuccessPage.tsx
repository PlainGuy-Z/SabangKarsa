import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { UserData } from '@/types/userData';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function VerificationSuccessPage() {
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  const { t } = useTranslation();
  
  if (!userData.id || userData.role !== "buyer") {
    navigate(-1);
  }

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-gradient-to-b from-[oklch(0.5809_0.0963_194.83)] to-[oklch(0.8588_0.0371_172.63)] dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-700" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold text-white mb-4"
        >
          {t("vs-success")}
        </motion.h1>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4 mb-8"
        >
          <p className="text-white">
            {t("vs-thanks")}
          </p>
          
          <div className="bg-emerald-50 dark:bg-emerald-50 border [border-color:oklch(0.5809_0.0963_194.83)] rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{t("vs-on-progress")}</span>
            </div>
            <p className="text-sm text-emerald-700">
              {t("vs-note")}
            </p>
          </div>

          <div className="text-left bg-emerald-200 dark:bg-emerald-200 rounded-lg p-4">
            <h3 className="font-medium text-white mb-2">{t("vs-next-steps")}</h3>
            <ul className="text-sm text-white space-y-1">
              <li>• {t("vs-step-1")}</li>
              <li>• {t("vs-step-2")}</li>
              <li>• {t("vs-step-3")}</li>
              <li>• {t("vs-step-4")}</li>
            </ul>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("vs-back-btn")}
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t("vs-home-btn")}
          </Button>
        </motion.div>

        {/* Auto redirect notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-xs text-muted-foreground mt-6"
        >
          {t("vs-home-msg")}
        </motion.p>
      </motion.div>
    </div>
  );
}
