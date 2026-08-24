import { Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface VerificationStatusBadgeProps {
  status: 'none' | 'pending' | 'approved' | 'rejected';
}

export function VerificationStatusBadge({ status }: VerificationStatusBadgeProps) {
  const { t } = useTranslation();
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: t("verif-label-1"),
          className: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          label: t("verif-label-2"),
          className: 'text-green-600 bg-green-50 dark:bg-green-900/20',
        };
      case 'rejected':
        return {
          icon: XCircle,
          label: t("verif-label-3"),
          className: 'text-red-600 bg-red-50 dark:bg-red-900/20',
        };
      default:
        return {
          icon: Shield,
          label: t("verif-label-4"),
          className: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.className}`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
}
