import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'badge-blue-bg',
    icon: 'text-blue-600 dark:text-blue-400',
    value: 'text-blue-600 dark:text-blue-400'
  },
  emerald: {
    bg: 'badge-emerald-bg',
    icon: 'text-emerald-700 dark:text-emerald-400',
    value: 'text-emerald-700 dark:text-emerald-400'
  },
  purple: {
    bg: 'badge-purple-bg',
    icon: 'text-purple-600 dark:text-purple-400',
    value: 'text-purple-600 dark:text-purple-400'
  },
  orange: {
    bg: 'badge-orange-bg',
    icon: 'text-orange-600 dark:text-orange-400',
    value: 'text-orange-600 dark:text-orange-400'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900',
    icon: 'text-red-600 dark:text-red-400',
    value: 'text-red-600 dark:text-red-400'
  }
};

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-admin-card rounded-lg border border-admin p-6 transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-admin-muted mb-2">
            {title}
          </h3>
          <p className={`text-3xl font-bold ${colors.value}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
