import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export default function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="bg-white shadow-sm border-b">
      <button onClick={() => navigate(-1)} className='text-gray-600 hover:text-gray-900'>{t("dsell-back-btn")}</button>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">{t("dsell-header")}</h1>
          <p className="text-gray-600 mt-2">{t("dsell-line")}</p>
        </motion.div>
      </div>
    </div>
  );
}