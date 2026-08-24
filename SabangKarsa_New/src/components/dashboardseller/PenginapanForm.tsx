import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Phone, User, MapPin, Mail } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import type { UserData } from '@/types/userData';
import type { EditData } from '@/pages/layanan/dashboard/DashboardPage';
import "../../i18n/i18n"

interface PenginapanData {
  nama: string;
  lokasi: string;
  deskripsi: string;
  tipePeningapan: string;
  hargaPerMalam: string;
  jumlahKamarTersedia: string;
  namaPenyedia: string;
  gambar: File | null;
  alamat: string;
  no_telepon: string;
  email: string;
  fasilitas: string;
  kebijakan: string;
  check_in_time: string;
  check_out_time: string;
  lokasi_maps: string;
}

interface PenginapanFormProps {
  token: string | null;
  user: { id: string; name: string; email: string; no_hp: string; alamat: string; role: string; };
  setActiveForm: () => void;
  setter: (data: EditData) => void;
  editData?: EditData;
}

export default function PenginapanForm({ token, user, setActiveForm, editData, setter }: PenginapanFormProps) {
  const [penginapanData, setPenginapanData] = useState<PenginapanData>({
    nama: '',
    lokasi: '',
    deskripsi: '',
    tipePeningapan: '',
    hargaPerMalam: '',
    jumlahKamarTersedia: '',
    namaPenyedia: user.name || '',
    gambar: null,
    alamat: '',
    no_telepon: '',
    email: '',
    fasilitas: '',
    kebijakan: '',
    check_in_time: '',
    check_out_time: '',
    lokasi_maps: ''
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
  
  if (editData?.key !== "penginapan") newEditData = null;
  
  useEffect(() => {
    if (editData?.key && editData?.key !== "penginapan") setter({key: "", data: null});
  }, [editData?.key, setter]);

  // Auto-fill data saat edit
  useEffect(() => {
    if (newEditData) {
      setPenginapanData({
        nama: newEditData.nama || '',
        lokasi: newEditData.lokasi || '',
        deskripsi: newEditData.deskripsi || '',
        tipePeningapan: newEditData.tipePeningapan || '',
        hargaPerMalam: String(newEditData.hargaPerMalam || ''),
        jumlahKamarTersedia: String(newEditData.jumlahKamarTersedia || ''),
        namaPenyedia: newEditData.namaPenyedia || user.name || '',
        gambar: null, // file tidak ada
        alamat: newEditData.alamat || '',
        no_telepon: newEditData.no_telepon || '',
        email: newEditData.email || '',
        fasilitas: Array.isArray(newEditData.fasilitas) ? newEditData.fasilitas.join(', ') : newEditData.fasilitas || '',
        kebijakan: newEditData.kebijakan || '',
        check_in_time: newEditData.check_in_time || '',
        check_out_time: newEditData.check_out_time || '',
        lokasi_maps: newEditData.lokasi_maps || ''
      });
      setPreview(newEditData.gambar); // pakai url lama
    }
  }, [newEditData, user.name]);

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'file' && files && files[0]) {
      setPenginapanData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setPenginapanData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUploadImage = () => {
    inputRef.current?.click();
  }

  // Submit form
  const submitPenginapan = async () => {
    try {
      const form = new FormData();
      Object.entries(penginapanData).forEach(([key, val]) => {
        if (val !== null) form.append(key, val as string | Blob);
      });
      form.append('penyedia', user.id);

      const apiUrl = import.meta.env.VITE_API_URL;
      if (newEditData) {
        await fetch(`${apiUrl}/penginapan/${newEditData._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
      } else {
        await fetch(`${apiUrl}/penginapan`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });
      }

      // Reset & kembali
      setActiveForm();
      setPenginapanData({
        nama: '', lokasi: '', deskripsi: '', tipePeningapan: '', hargaPerMalam: '',
        jumlahKamarTersedia: '', namaPenyedia: user.name || '', gambar: null,
        alamat: '', no_telepon: '', email: '', fasilitas: '', kebijakan: '',
        check_in_time: '', check_out_time: '', lokasi_maps: ''
      });
      setPreview(null);
      window.location.reload();
    } catch (e) {
      console.error(t("dsell-pf-err"), e);
    }
  };

  return (
    <>
      <div className="bg-emerald-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{newEditData ? t("dsell-btn-1") : t("dsell-btn-2")}</h2>
          <button onClick={() => setActiveForm()} className="text-white hover:text-emerald-200 text-sm font-medium">← {t("dsell-back-btn")}</button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label={t("dsell-label-1")} name="nama" value={penginapanData.nama} onChange={handleChange} placeholder={t("dsell-ph-1")} />
          <InputWithIcon icon={MapPin} label={t("dsell-label-2")} name="lokasi" value={penginapanData.lokasi} onChange={handleChange} placeholder={t("dsell-ph-2")} />
          <Select label={t("dsell-label-3")} name="tipePeningapan" value={penginapanData.tipePeningapan} onChange={handleChange}
            options={['Hotel','Villa','Guest House','Resort','Homestay','Boutique Hotel','Inn','Motel']} />
          <Input label={t("dsell-label-4")} name="hargaPerMalam" value={penginapanData.hargaPerMalam} onChange={handleChange} placeholder="300000" type="number" />
          <Input label={t("dsell-label-5")} name="jumlahKamarTersedia" value={penginapanData.jumlahKamarTersedia} onChange={handleChange} placeholder="10" type="number" />
          <InputWithIcon icon={User} label={t("dsell-label-6")} name="namaPenyedia" value={penginapanData.namaPenyedia} onChange={handleChange} placeholder={t("dsell-ph-6")} />
          <InputWithIcon icon={Phone} label={t("dsell-label-7")} name="no_telepon" value={penginapanData.no_telepon} onChange={handleChange} placeholder="08123456789" />
          <InputWithIcon icon={Mail} label={t("dsell-label-8")} name="email" value={penginapanData.email} onChange={handleChange} placeholder="email@example.com" />
          <Input label={t("dsell-label-9")} name="alamat" value={penginapanData.alamat} onChange={handleChange} placeholder="Jl. Diponegoro No.123" />
          <Input label={t("dsell-label-10")} name="check_in_time" value={penginapanData.check_in_time} onChange={handleChange} placeholder="14:00" />
          <Input label={t("dsell-label-11")} name="check_out_time" value={penginapanData.check_out_time} onChange={handleChange} placeholder="12:00" />
        </div>
        <Textarea label={t("dsell-label-12")} name="deskripsi" value={penginapanData.deskripsi} onChange={handleChange} placeholder={t("dsell-ph-12")} rows={4} />
        <Input label={t("dsell-label-13")} name="fasilitas" value={penginapanData.fasilitas} onChange={handleChange} placeholder="WiFi, AC, TV..." />
        <Textarea label={t("dsell-label-14")} name="kebijakan" value={penginapanData.kebijakan} onChange={handleChange} placeholder={t("dsell-ph-14")} rows={3} />
        <Input label={t("dsell-label-15")} name="lokasi_maps" value={penginapanData.lokasi_maps} onChange={handleChange} placeholder="https://maps.google.com/..." />
        <div className="space-y-2">
          <label className="form-label text-sm">{t("dsell-label-16")}</label>
          <div onClick={handleUploadImage} className="cursor-pointer form-upload-area transition-colors">
            {preview ? (
              <img src={preview} alt="Preview" className="mx-auto mb-2 max-h-48 object-contain rounded" />
            ) : (
              <Upload className="w-8 h-8 form-icon mx-auto mb-2" />
            )}
            <input ref={inputRef} type="file" name="gambar" onChange={handleChange} className="hidden" id="penginapan-image" accept="image/*" />
            <label htmlFor="penginapan-image" className="cursor-pointer text-sm text-admin">
              {preview ? t("dsell-label-16-1") : t("dsell-label-16-2")}
            </label>
          </div>
        </div>
        <Button onClick={submitPenginapan} className="w-full bg-emerald-500 hover:bg-emerald-500 text-white py-3 text-lg font-medium">
          {newEditData ? t("dsell-submit-btn-1") : t("dsell-submit-btn-2")}
        </Button>
      </div>
    </>
  );
}



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

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      <label className="form-label text-sm">{label}</label>
      <textarea {...props} className="form-input resize-none" />
    </div>
  );
}

function Select({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="form-label text-sm">{label}</label>
      <select {...props} className="form-input">
        <option value="">{t("dsell-select")}</option>
        {options.map((opt) => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
      </select>
    </div>
  );
}
