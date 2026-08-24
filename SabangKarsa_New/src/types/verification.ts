export interface VerificationDocument {
  id: string;
  type: 'ktp' | 'npwp' | 'dokumenBisnis';
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface VerificationRequest {
  _id?: string;
  user: string;
  npwp: string;
  ktp: string;
  dokumenBisnis: string;
  status: 'pending' | 'approved' | 'rejected';
  no_rekening: string;
  nama_rekening: string;
  catatan?: string;
  createdAt?: string;
  updatedAt?: string;
  // Keep old fields for backward compatibility
  id?: string;
  userId?: string;
  fullName?: string;
  nik?: string;
  phoneNumber?: string;
  address?: string;
  businessType?: string;
  businessDescription?: string;
  documents?: VerificationDocument[];
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  verificationRequestId?: string;
}

export type DocumentType = {
  id: 'ktp' | 'npwp' | 'dokumenBisnis';
  label: string;
  description: string;
  required: boolean;
  maxSize: number; // in MB
  acceptedFormats: string[];
};
