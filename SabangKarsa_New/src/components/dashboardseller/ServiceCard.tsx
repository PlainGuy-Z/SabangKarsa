import React from 'react';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface ServiceCardProps {
  option: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
  onClick: () => void;
}

export default function ServiceCard({ option, onClick }: ServiceCardProps) {
  const IconComponent = option.icon;
  const { t } = useTranslation();

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105">
        <div className={`h-32 bg-gradient-to-r ${option.color} flex items-center justify-center`}>
          <IconComponent className="w-12 h-12 text-white" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{option.description}</p>
          <div className="flex items-center text-green-600 text-sm font-semibold">
            {t("servc-text")}
          </div>
        </div>
      </div>
    </div>
  );
}