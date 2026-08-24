import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface SellerStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'purple' | 'orange' | 'red';
  description?: string;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-blue-600 dark:text-blue-400'
  },
  emerald: {
    bg: 'bg-emerald-500',
    hover: 'hover:bg-emerald-600',
    text: 'text-emerald-500 dark:text-emerald-500'
  },
  purple: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    text: 'text-purple-600 dark:text-purple-400'
  },
  orange: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    text: 'text-orange-600 dark:text-orange-400'
  },
  red: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    text: 'text-red-600 dark:text-red-400'
  }
};

export function SellerStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  description,
  onClick 
}: SellerStatsCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-admin-card rounded-lg border border-admin p-6 transition-all duration-200 hover:shadow-lg ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-admin-muted mb-2">
            {title}
          </h3>
          <p className={`text-3xl font-bold ${colors.text}`}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-admin-muted mt-2">
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg} text-white ${colors.hover} transition-colors`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
