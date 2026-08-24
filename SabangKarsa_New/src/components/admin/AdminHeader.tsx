import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

export function AdminHeader({ 
  title, 
  subtitle, 
  showAddButton = false, 
  onAddClick, 
  addButtonText = localStorage.getItem("language") === "ID" ? "Tambah" : "Add" 
}: AdminHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-admin-card border-b border-admin px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin">
            {title}
          </h1>
          {subtitle && (
            <p className="text-admin-muted mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Add Button */}
          {showAddButton && (
            <Button
              onClick={onAddClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              {addButtonText}
            </Button>
          )}

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-admin">
            <div className="text-right">
              <p className="text-sm font-medium text-admin">
                Admin
              </p>
              <p className="text-xs text-admin-muted">
                Administrator
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
