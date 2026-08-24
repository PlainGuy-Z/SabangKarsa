import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Phone, User, MapPin } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import type { UserData } from '@/types/userData';
import type { EditData } from '@/pages/layanan/dashboard/DashboardPage';
import "../../i18n/i18n"

interface TourGuideData {
  name: string;
  no_hp: string;
  instagram: string;
  kataKata: string;
  wilayah: string;
  harga: string;
  foto: File | null;
}

interface TourGuideFormProps {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    no_hp: string;
    alamat: string;
    role: string;
  };
  editData?: EditData;
  setActiveForm: () => void;
  setter: (data: EditData) => void;
}

export default function TourGuideForm({ token, user, setActiveForm, editData, setter }: TourGuideFormProps) {
  const [tourGuideData, setTourGuideData] = useState<TourGuideData>({
    name: '',
    no_hp: '',
    instagram: '',
    kataKata: '',
    wilayah: '',
    harga: '',
    foto: null
  });

  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  let newEditData = editData?.data;
      
  useEffect(() => {
    if (!userData.id || userData.role !== "seller") {
      navigate(-1);
    }
  }, [userData, navigate]);

  if (editData?.key !== "tourguide") newEditData = null;

  useEffect(() => {
    if (editData?.key && editData?.key !== "tourguide") setter({key: "", data: null});
  }, [editData?.key, setter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'file' && files && files[0]) {
      setTourGuideData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setTourGuideData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadImage = () => {
    inputRef.current?.click();
  }

  useEffect(() => {
    if (newEditData) {
      setTourGuideData({
        name: newEditData.name || '',
        no_hp: newEditData.no_hp || '',
        instagram: newEditData.instagram || '',
        kataKata: newEditData.kataKata || '',
        wilayah: newEditData.wilayah || '',
        harga: newEditData.harga || '',
        foto: null
      });
      setPreview(newEditData.foto);
    }
  }, [newEditData, user.name]);

  const submitTourGuide = async () => {
    try {
      const form = new FormData();
      Object.entries(tourGuideData).forEach(([key, val]) => {
        if (val !== null) form.append(key, val as string | Blob);
      });
      form.append('penyedia', user.id); // auto-set penyedia

      const apiUrl = import.meta.env.VITE_API_URL;
      if (newEditData) {
        await fetch(`${apiUrl}/tourguides/${newEditData._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
      } else {
        await fetch(`${apiUrl}/tourguides`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
      }

      setActiveForm();
      setTourGuideData({
        name: '', no_hp: '', instagram: '', kataKata: '', wilayah: '', harga: '', foto: null
      });
      setPreview(null);
    } catch (e) {
      console.error(t("tgf-err-msg"), e);
    }
  };

  return (
    <>
      <div className="bg-emerald-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{t("tgf-header")}</h2>
          <button
            onClick={() => setActiveForm()}
            className="text-white hover:text-emerald-200 text-sm font-medium"
          >
            ← {t("tgf-back-btn")}
          </button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="form-label text-sm">{t("tgf-label-1")}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 form-icon" />
              <input
                name="name"
                placeholder="John Doe"
                value={tourGuideData.name}
                onChange={handleChange}
                className="form-input-with-icon"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="form-label text-sm">{t("tgf-label-2")}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 form-icon" />
              <input
                name="no_hp"
                placeholder="08123456789"
                value={tourGuideData.no_hp}
                onChange={handleChange}
                className="form-input-with-icon"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="form-label text-sm">{t("tgf-label-3")}</label>
            <input
              name="instagram"
              placeholder="@johndoe"
              value={tourGuideData.instagram}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <label className="form-label text-sm">{t("tgf-label-4")}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 form-icon" />
              <input
                name="wilayah"
                placeholder="Sabang, Aceh"
                value={tourGuideData.wilayah}
                onChange={handleChange}
                className="form-input-with-icon"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="form-label text-sm">{t("tgf-label-5")}</label>
            <input
              name="harga"
              placeholder="500000"
              type="number"
              value={tourGuideData.harga}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="form-label text-sm">{t("tgf-label-6")}</label>
          <textarea
            name="kataKata"
            placeholder={t("tgf-ph-6")}
            rows={4}
            value={tourGuideData.kataKata}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="space-y-2">
          <label className="form-label text-sm">{t("tgf-label-7")}</label>
          <div onClick={handleUploadImage} className="cursor-pointer form-upload-area hover:border-green-400 transition-colors">
            {preview ? (
              <img src={preview} alt="Preview" className="mx-auto mb-2 max-h-48 object-contain rounded" />
            ) : (
              <Upload className="w-8 h-8 form-icon mx-auto mb-2" />
            )}
            <input
              ref={inputRef}
              type="file"
              name="foto"
              onChange={handleChange}
              className="hidden"
              id="guide-photo"
              accept="image/*"
            />
            <label htmlFor="guide-photo" className="cursor-pointer text-sm text-admin">
              {preview ? t("tgf-label-7-1") : t("tgf-label-7-2")}
            </label>
          </div>
        </div>
        <Button
          onClick={submitTourGuide}
          className="w-full bg-emerald-500 hover:bg-emerald-500 text-white py-3 text-lg font-medium"
        >
          {newEditData ? t("tgf-submit-btn-1") : t("tgf-submit-btn-2")}
        </Button>
      </div>
    </>
  );
}
