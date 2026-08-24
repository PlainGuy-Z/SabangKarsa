const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

const penginapanStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sabangkarsa/penginapan", 
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadPenginapan = multer({
  storage: penginapanStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung'), false);
    }
  }
});

module.exports = uploadPenginapan;
