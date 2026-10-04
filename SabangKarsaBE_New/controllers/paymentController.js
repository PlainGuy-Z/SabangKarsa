const { Invoice } = require('xendit-node');

// Initialize Xendit Invoice client (v7)
const invoiceClient = new Invoice({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

// Create Xendit Invoice
exports.createInvoice = async (req, res) => {
  try {
    const { amount, description, externalId, payerEmail } = req.body;
    
    if (!amount || !externalId || !payerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, externalId, payerEmail' 
      });
    }

    const invoice = await invoiceClient.createInvoice({
      data: {
        externalId: externalId,
        amount: amount,
        payerEmail: payerEmail,
        description: description || `Payment for booking ${externalId}`,
        invoiceDuration: 86400, // 24 hours
        successRedirectUrl: `${process.env.FRONTEND_URL}/pesanan?payment=success`,
        failureRedirectUrl: `${process.env.FRONTEND_URL}/pesanan?payment=failed`,
        currency: 'IDR',
      },
    });

    console.log('✅ Xendit invoice created:', invoice.id);

    res.json({
      id: invoice.id,
      external_id: invoice.externalId,
      invoice_url: invoice.invoiceUrl,
      status: invoice.status,
      amount: invoice.amount,
      expiry_date: invoice.expiryDate,
    });
  } catch (error) {
    console.error('❌ Xendit create invoice error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create payment invoice' 
    });
  }
};


// Handle Xendit Webhook
exports.handleWebhook = async (req, res) => {
  try {
    const callbackToken = req.headers['x-callback-token'];
    
    // Verify callback token
    if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
      console.error('❌ Invalid callback token');
      return res.status(403).json({ error: 'Invalid callback token' });
    }

    const { external_id, status, id } = req.body;
    
    console.log('📥 Xendit webhook received:', { external_id, status, id });

    // Import models (avoid circular dependency)
    const Booking = require('../models/Booking');
    const BookingPaket = require('../models/BookingPaket');
    const BookingRental = require('../models/BookingRental');
    const BookingTourGuide = require('../models/BookingTourGuide');

    // Try to find booking in all collections.
    // Note: external_id for Penginapan is the ObjectId, but for Rental and TourGuide it's a custom string (e.g. ORDER-xxx) which we saved in payment_id (during create transaction)
    let booking;
    // Check Penginapan first (where external_id is the _id)
    if (external_id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(external_id);
      if (!booking) booking = await BookingPaket.findById(external_id);
    }
    
    // If not found, check other collections by payment_id
    if (!booking) booking = await BookingRental.findOne({ payment_id: external_id });
    if (!booking) booking = await BookingTourGuide.findOne({ payment_id: external_id });

    if (booking) {
      // Update payment status based on Xendit status
      if (status === 'PAID') {
        booking.status_pembayaran = 'paid';
      } else if (status === 'EXPIRED') {
        booking.status_pembayaran = 'failed';
      }
      booking.payment_id = id;
      await booking.save();

      console.log('✅ Booking updated:', booking._id, 'Status:', booking.status_pembayaran);
    } else {
      console.warn('⚠️ Booking not found:', external_id);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check Payment Status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await invoiceClient.getInvoiceById({ invoiceId: invoiceId });

    res.json({
      id: invoice.id,
      external_id: invoice.externalId,
      status: invoice.status,
      amount: invoice.amount,
    });
  } catch (error) {
    console.error('❌ Check payment status error:', error);
    res.status(500).json({ error: error.message });
  }
};
