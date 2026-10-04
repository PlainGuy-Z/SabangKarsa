const VerifikasiSeller = require("../models/VerifikasiSeller");
const User = require("../models/User");

exports.ajukanVerifikasi = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Autentikasi gagal" });
    }

    const userId = req.user.id;

    const existing = await VerifikasiSeller.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ error: "Pengajuan verifikasi sudah ada" });
    }

    const { npwp, ktp, dokumenBisnis } = req.files;
    const { no_rekening, nama_rekening } = req.body;

    if (!npwp || !ktp || !dokumenBisnis) {
      return res.status(400).json({ error: "Semua dokumen harus diunggah" });
    }

    const newRequest = await VerifikasiSeller.create({
      user: userId,
      npwp: npwp[0].path,
      ktp: ktp[0].path,
      dokumenBisnis: dokumenBisnis[0].path,
      no_rekening,
      nama_rekening,
    });

    res
      .status(201)
      .json({ message: "Pengajuan verifikasi berhasil", data: newRequest });
  } catch (err) {
    console.error("Error di ajukanVerifikasi:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

exports.getStatusVerifikasi = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Autentikasi gagal" });
    }

    const userId = req.user.id;
    const status = await VerifikasiSeller.findOne({ user: userId }).select(
      "status catatan"
    ); // Hanya ambil status dan catatan
    if (!status)
      return res.status(404).json({ message: "Belum mengajukan verifikasi" });
    res.status(200).json(status);
  } catch (err) {
    console.error("Error in getStatusVerifikasi:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
