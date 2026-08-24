import { motion } from 'framer-motion';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
}

export function DataTable({ 
  title, 
  subtitle, 
  columns, 
  data, 
  loading = false, 
  onRowClick,
  emptyMessage = localStorage.getItem("language") === "ID" ? "Tidak ada data ditemukan" : "No data found"
}: DataTableProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-admin-card rounded-lg border border-admin overflow-hidden">
        <div className="px-6 py-4 border-b border-admin">
          <h2 className="text-lg font-semibold text-admin">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-admin-muted">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-muted-foreground dark:text-muted-foreground mt-4">{t("admin-dt-loading")}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-admin-card rounded-lg border border-admin overflow-hidden">
        <div className="px-6 py-4 border-b border-admin">
          <h2 className="text-lg font-semibold text-admin">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-admin-muted">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-8 text-center">
          <p className="text-admin-muted">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-admin-card rounded-lg border border-admin overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-admin">
        <h2 className="text-lg font-semibold text-admin">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-admin-muted">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 dark:bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                {t("admin-dt-number")}
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                {t("admin-dt-act")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-border">
            {data.map((row, index) => (
              <motion.tr
                key={row._id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/20 dark:hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground dark:text-foreground">
                  {index + 1}
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 whitespace-nowrap text-sm text-foreground dark:text-foreground ${column.className || ''}`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick?.(row);
                      }}
                      className="p-1 h-8 w-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
