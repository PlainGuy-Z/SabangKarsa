const Booking = require("../models/Booking");
const Penginapan = require("../models/Penginapan");
const { Xendit } = require('xendit-node');

// Initialize Xendit
const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

exports.createBooking = async (req, res) => {
  try {
    const { penginapan, check_in_date, check_out_date, jumlah_kamar } = req.body;

    // Step 0: Validasi input
    if (!jumlah_kamar || jumlah_kamar < 1) {
      return res.status(400).json({ error: "Jumlah kamar harus diisi minimal 1" });
    }

    const penginapanData = await Penginapan.findById(penginapan);
    if (!penginapanData) {
      return res.status(404).json({ error: "Penginapan tidak ditemukan" });
    }

    // Step 1: Cari booking lain yang overlap
    const overlappingBookings = await Booking.find({
      penginapan,
      status_pembayaran: { $in: ["pending", "paid"] },
      $or: [
        {
          check_in_date: { $lt: new Date(check_out_date) },
          check_out_date: { $gt: new Date(check_in_date) },
        },
      ],
    });

    const totalKamarTerbooking = overlappingBookings.reduce((sum, b) => sum + b.jumlah_kamar, 0);
    if (totalKamarTerbooking + jumlah_kamar > penginapanData.jumlah_kamar) {
      return res.status(400).json({ error: "Kamar tidak tersedia pada tanggal tersebut" });
    }

    // Step 2: Hitung total harga
    const lamaInap = Math.ceil(
      (new Date(check_out_date) - new Date(check_in_date)) / (1000 * 60 * 60 * 24)
    );
    if (lamaInap < 1) {
      return res.status(400).json({ error: "Tanggal check-in dan check-out tidak valid" });
    }

    const total_harga = penginapanData.hargaPerMalam * lamaInap * jumlah_kamar;

    // Step 3: Buat booking di DB
    const booking = await Booking.create({
      user: req.user.id,
      penginapan,
      check_in_date,
      check_out_date,
      jumlah_kamar,
      total_harga,
      status_pembayaran: 'pending',
    });

    // Step 4: Create Xendit Invoice
    try {
      const { Invoice } = xendit;
      const invoiceSpecificOptions = {};
      const i = new Invoice(invoiceSpecificOptions);

      const invoice = await i.createInvoice({
        externalID: booking._id.toString(),
        amount: total_harga,
        payerEmail: req.user.email,
        description: `Booking ${penginapanData.nama} - ${jumlah_kamar} kamar, ${lamaInap} malam`,
        invoiceDuration: 86400, // 24 hours
        successRedirectURL: `${process.env.FRONTEND_URL}/bookings?payment=success`,
        failureRedirectURL: `${process.env.FRONTEND_URL}/bookings?payment=failed`,
      });

      // Update booking with payment info
      booking.payment_id = invoice.id;
      await booking.save();

      console.log('✅ Xendit invoice created for booking:', booking._id);

      return res.status(201).json({
        success: true,
        message: 'Booking berhasil dibuat',
        booking,
        payment_url: invoice.invoice_url,
      });

    } catch (xenditError) {
      console.error('❌ Xendit error:', xenditError);
      
      // Booking sudah dibuat tapi payment gagal - tetap return booking
      return res.status(201).json({
        success: true,
        message: 'Booking berhasil dibuat, tetapi payment link gagal. Silakan hubungi admin.',
        booking,
        payment_url: null,
      });
    }


  } catch (err) {
    console.error("❌ Error in createBooking:", err);
    res.status(400).json({ error: err.message || "Unknown error" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const data = await Booking.find({ user: req.user.id }).populate(
      "penginapan"
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "penginapan"
    );
    if (!booking)
      return res.status(404).json({ error: "Booking tidak ditemukan" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status_pembayaran, payment_id } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (status_pembayaran) booking.status_pembayaran = status_pembayaran;
    if (payment_id) booking.payment_id = payment_id;

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// NOTE: Booking penginapan menggunakan Xendit, bukan Midtrans.
// Webhook Xendit di-handle oleh paymentController.handleWebhook
// Handler ini dipertahankan untuk backward compatibility tapi tidak aktif.
exports.handleMidtransCallback = async (req, res) => {
  res.status(200).json({ message: "This endpoint is deprecated. Penginapan uses Xendit webhook." });
};
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBookingsForSeller = async (req, res) => {
  try {
      // Cari semua penginapan milik seller ini
      const penginapanSeller = await Penginapan.find({ penyedia: req.user.id }).select('_id');
      const penginapanIds = penginapanSeller.map(p => p._id);

      // Cari booking untuk penginapan tersebut
      const bookings = await Booking.find({ penginapan: { $in: penginapanIds } })
        .populate("user")
        .populate("penginapan");
  
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      console.error("[getBookingsForSeller - Penginapan]", err.message);
      res.status(500).json({
        success: false,
        error: "Terjadi kesalahan pada server"
      });
    }
};
