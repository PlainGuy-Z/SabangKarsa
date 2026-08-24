import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Car, Phone, AlignLeft } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import type { UserData } from '@/types/userData';
import type { EditData } from '@/pages/layanan/dashboard/DashboardPage';
import "../../i18n/i18n"

interface RentalData {
  name: string;
  type: string;
  harga: string;
  deskripsi: string;
  gambar: File | null;
  no_telepon: string;
}

interface RentalFormProps {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    no_hp: string;
    alamat: string;
    role: string;
  };
  setActiveForm: () => void;
  setter: (data: EditData) => void;
  editData?: EditData;
}

export default function RentalForm({ token, user, setActiveForm, editData, setter }: RentalFormProps) {
  const [rentalData, setRentalData] = useState<RentalData>({
    name: '',
    type: '',
    harga: '',
    deskripsi: '',
    gambar: null,
    no_telepon: user.no_hp || ''
  });
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  let newEditData = editData?.data;
    
  if (!userData.id || userData.role !== "seller") {
    navigate(-1);
  }
  
  if (editData?.key !== "rental") newEditData = null;
  
  useEffect(() => {
    if (editData?.key && editData?.key !== "rental") setter({key: "", data: null});
  }, [editData?.key, setter]);

  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Isi data saat edit
  useEffect(() => {
    if (newEditData) {
      setRentalData({
        name: newEditData.name || '',
        type: newEditData.type || '',
        harga: String(newEditData.harga || ''),
        deskripsi: newEditData.deskripsi || '',
        gambar: null,
        no_telepon: newEditData.no_telepon || user.no_hp || ''
      });
      setPreview(newEditData.gambar); // pakai url lama
    }
  }, [newEditData, user.no_hp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'file' && files && files[0]) {
      setRentalData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setRentalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadImage = () => {
    inputRef.current?.click();
  }

  const submitRental = async () => {
    try {
      const form = new FormData();
      form.append('name', rentalData.name);
      form.append('type', rentalData.type);
      form.append('harga', rentalData.harga);
      form.append('deskripsi', rentalData.deskripsi);
      if (rentalData.gambar) form.append('gambar', rentalData.gambar);
      form.append('penyedia', user.id);
      form.append('namaPenyedia', user.name);
      form.append('no_telepon', rentalData.no_telepon);

      const apiUrl = import.meta.env.VITE_API_URL;
      if (newEditData) {
        // Update data (PUT)
        await fetch(`${apiUrl}/rental/${newEditData._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
      } else {
        // Tambah data baru (POST)
        await fetch(`${apiUrl}/rental`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
      }

      // Reset dan kembali
      setActiveForm();
      setRentalData({ name: '', type: '', harga: '', deskripsi: '', gambar: null, no_telepon: user.no_hp || '' });
      setPreview(null);
      window.location.reload();
    } catch (e) {
      console.error(t("rf-err-msg"), e);
    }
  };

  return (
    <>
      <div className="bg-emerald-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{newEditData ? t("rf-header-1") : t("rf-header-2")}</h2>
          <button onClick={() => setActiveForm()} className="text-white hover:text-emerald-200 text-sm font-medium">
            ← {t("rf-back-btn")}
          </button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon icon={Car} label={t("rf-label-1")} name="name" value={rentalData.name} onChange={handleChange} placeholder="Toyota Avanza" />
          <Select label={t("rf-label-2")} name="type" value={rentalData.type} onChange={handleChange} options={[t("rf-label-2-1"),t("rf-label-2-2"),t("rf-label-2-3")]} />
          <Input label={t("rf-label-3")} name="harga" type="number" value={rentalData.harga} onChange={handleChange} placeholder="350000" />
          <InputWithIcon icon={Phone} label={t("rf-label-4")} name="no_telepon" value={rentalData.no_telepon} onChange={handleChange} placeholder="08123456789" />
        </div>
        <TextareaWithIcon icon={AlignLeft} label={t("rf-label-5")} name="deskripsi" value={rentalData.deskripsi} onChange={handleChange} placeholder={t("rf-ph-5")} rows={3} />
        <div className="space-y-2">
          <label className="form-label text-sm">{t("rf-label-6")}</label>
          <div onClick={handleUploadImage} className="cursor-pointer form-upload-area transition-colors">
            {preview ? (
              <img src={preview} alt="Preview" className="mx-auto mb-2 max-h-48 object-contain rounded" />
            ) : (
              <Upload className="w-8 h-8 form-icon mx-auto mb-2" />
            )}
            <input ref={inputRef} type="file" name="gambar" onChange={handleChange} className="hidden" id="rental-photo" accept="image/*" />
            <label htmlFor="rental-photo" className="cursor-pointer text-sm text-admin">
              {preview ? t("rf-label-6-1") : t("rf-label-6-2")}
            </label>
          </div>
        </div>
        <Button onClick={submitRental} className="w-full bg-emerald-500 hover:bg-emerald-500 text-white py-3 text-lg font-medium">
          {newEditData ? t("rf-submit-btn-1") : t("rf-submit-btn-2")}
        </Button>
      </div>
    </>
  );
}

// Komponen kecil
function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="form-label text-sm">{label}</label>
      <input {...props} className="form-input" />
    </div>
  );
}

function InputWithIcon({ label, icon: Icon, ...props }: { label: string; icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="form-label text-sm">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 form-icon" />
        <input {...props} className="form-input-with-icon" />
      </div>
    </div>
  );
}

function TextareaWithIcon({ label, icon: Icon, ...props }: { label: string; icon: React.ElementType } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      <label className="form-label text-sm">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-4 h-4 form-icon" />
        <textarea {...props} className="form-input-with-icon resize-none" />
      </div>
    </div>
  );
}

function Select({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <label className="form-label text-sm">{label}</label>
      <select {...props} className="form-input">
        <option value="">{t("rf-select")}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
      </select>
    </div>
  );
}
