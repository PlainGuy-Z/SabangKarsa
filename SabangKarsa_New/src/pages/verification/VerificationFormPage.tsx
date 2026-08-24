import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Upload, FileText, User, AlertCircle, CheckCircle, X, Eye
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ThemeToggle } from '../../components/theme-toogle';
import { Footer } from '../../components/layouts/footer';
import type { VerificationRequest, DocumentType } from '../../types/verification';
import type { UserData } from '@/types/userData';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

const API_URL = import.meta.env.VITE_API_URL;

export function VerificationFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  const documentTypes = useMemo<DocumentType[]>(() => [
    { id: 'ktp', label: t("vf-label-1"), description: t("vf-desc-1"), required: true, maxSize: 10, acceptedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'] },
    { id: 'npwp', label: t("vf-label-2"), description: t("vf-desc-2"), required: true, maxSize: 10, acceptedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'] },
    { id: 'dokumenBisnis', label: t("vf-label-3"), description: t("vf-desc-3"), required: true, maxSize: 10, acceptedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'] }
  ], [t]);

  if (!userData.id || userData.role !== "buyer") {
    navigate(-1);
  }

  const [formData, setFormData] = useState<Partial<VerificationRequest>>({
    fullName: '', phoneNumber: '', address: '',
    no_rekening: '', nama_rekening: '', documents: []
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const user = typeof userData === 'object' && userData.user ? userData.user : userData;
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      phoneNumber: user.no_hp || user.phoneNumber || '',
      address: user.alamat || user.address || '',
      email: user.email || ''
    }));
  }, []);

  const handleInputChange = (field: keyof VerificationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileUpload = useCallback((documentType: string, file: File) => {
    const docType = documentTypes.find(dt => dt.id === documentType);
    if (!docType) return;

    if (file.size > docType.maxSize * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [documentType]: `${t("vf-err-msg-1")} ${docType.maxSize}MB` }));
      return;
    }
    if (!docType.acceptedFormats.includes(file.type)) {
      setErrors(prev => ({ ...prev, [documentType]: t("vf-err-msg-2") }));
      return;
    }

    setUploadedFiles(prev => ({ ...prev, [documentType]: file }));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => e.target?.result && setPreviewImages(prev => ({ ...prev, [documentType]: e.target!.result as string }));
      reader.readAsDataURL(file);
    }
    if (errors[documentType]) setErrors(prev => ({ ...prev, [documentType]: '' }));
  }, [errors, documentTypes, t]);

  const removeFile = (documentType: string) => {
    setUploadedFiles(prev => { const copy = { ...prev }; delete copy[documentType]; return copy; });
    setPreviewImages(prev => { const copy = { ...prev }; delete copy[documentType]; return copy; });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName?.trim()) newErrors.fullName = t("vf-warn-msg-1");
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = t("vf-warn-msg-2");
    if (!formData.no_rekening?.trim()) newErrors.no_rekening = t("vf-warn-msg-3");
    if (!formData.nama_rekening?.trim()) newErrors.nama_rekening = t("vf-warn-msg-4");

    documentTypes.forEach(doc => {
      if (doc.required && !uploadedFiles[doc.id]) newErrors[doc.id] = `${doc.label} ${t("vf-warn-msg-5")}`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!localStorage.getItem('token')) {
      setErrors({ submit: t("vf-err-msg-3") });
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch(`${API_URL}/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          name: formData.fullName, no_hp: formData.phoneNumber, alamat: formData.address
        })
      });

      const formDataToSend = new FormData();
      documentTypes.forEach(doc => {
        if (uploadedFiles[doc.id]) formDataToSend.append(doc.id, uploadedFiles[doc.id]);
      });
      formDataToSend.append('no_rekening', formData.no_rekening || '');
      formDataToSend.append('nama_rekening', formData.nama_rekening || '');

      const res = await fetch(`${API_URL}/verifikasi`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formDataToSend
      });
      if (res.ok) navigate('/');
      else setErrors({ submit: t("vf-err-msg-4") });
    } catch (e) {
      console.error('Error:', e);
      setErrors({ submit: t("vf-err-msg-5") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card bg-emerald-500 text-white dark:text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> {t("vf-back-btn")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("vf-header")}</h1>
              <p className="text-muted-foreground">{t("vf-line")}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Personal Info */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 dark:bg-emerald-500 rounded-lg">
                <User className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("vf-info-h")}</h2>
                <p className="text-sm text-muted-foreground">{t("vf-info-p")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t("vf-name-label")}</label>
                <input value={formData.fullName || ''} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground" placeholder={t("vf-name-ph")} />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("vf-phone-label")}</label>
                <input value={formData.phoneNumber || ''} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground" placeholder={t("vf-phone-ph")} />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t("vf-addr-label")}</label>
                <textarea value={formData.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground" placeholder={t("vf-addr-ph")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("vf-banknum-label")}</label>
                <input value={formData.no_rekening || ''} onChange={(e) => handleInputChange('no_rekening', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground" placeholder={t("vf-banknum-ph")} />
                {errors.no_rekening && <p className="text-red-500 text-sm mt-1">{errors.no_rekening}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("vf-bankname-label")}</label>
                <input value={formData.nama_rekening || ''} onChange={(e) => handleInputChange('nama_rekening', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-background text-foreground" placeholder={t("vf-bankname-ph")} />
                {errors.nama_rekening && <p className="text-red-500 text-sm mt-1">{errors.nama_rekening}</p>}
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 dark:bg-emerald-500 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("vf-verif-h")}</h2>
                <p className="text-sm text-muted-foreground">{t("vf-verif-p")}</p>
              </div>
            </div>

            {documentTypes.map(doc => (
              <div key={doc.id}>
                <label className="block font-medium">{doc.label} {doc.required && <span className="text-red-500">*</span>}</label>
                {uploadedFiles[doc.id] ? (
                  <div className="flex justify-between items-center p-2 bg-emerald-200 dark:bg-emerald-500 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-emerald-800 dark:text-emerald-400" /> <span>{uploadedFiles[doc.id].name}</span>
                    </div>
                    <div className="flex gap-2">
                      {previewImages[doc.id] && <Button size="sm" variant="ghost" onClick={() => window.open(previewImages[doc.id], '_blank')}><Eye className="w-4 h-4" /></Button>}
                      <Button size="sm" variant="ghost" onClick={() => removeFile(doc.id)}><X className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => document.getElementById(`file-${doc.id}`)?.click()} className="border-2 border-dashed rounded p-4 text-center hover:[border-color:oklch(0.4771_0.0777_205.67)] cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-sm">{t("vf-upload-btn")}</p>
                    <input type="file" id={`file-${doc.id}`} accept={doc.acceptedFormats.join(',')} onChange={(e) => e.target.files && handleFileUpload(doc.id, e.target.files[0])} className="hidden" />
                  </div>
                )}
                {errors[doc.id] && <p className="text-red-500 text-sm">{errors[doc.id]}</p>}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-500 text-white">
              {isSubmitting ? t("vf-btn-1") : t("vf-btn-2")}
            </Button>
          </div>

          {errors.submit && (
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-600 dark:text-red-400">{errors.submit}</span>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
