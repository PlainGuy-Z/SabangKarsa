const { Xendit } = require('xendit-node');

// Initialize Xendit
const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

const { Invoice } = xendit;

// Create Xendit Invoice
exports.createInvoice = async (req, res) => {
  try {
    const { amount, description, externalId, payerEmail } = req.body;
    
    if (!amount || !externalId || !payerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, externalId, payerEmail' 
      });
    }

    const invoiceSpecificOptions = {};
    const i = new Invoice(invoiceSpecificOptions);

    const invoice = await i.createInvoice({
      externalID: externalId,
      amount: amount,
      payerEmail: payerEmail,
      description: description || `Payment for booking ${externalId}`,
      invoiceDuration: 86400, // 24 hours
      successRedirectURL: `${process.env.FRONTEND_URL}/bookings?payment=success`,
      failureRedirectURL: `${process.env.FRONTEND_URL}/bookings?payment=failed`,
    });

    console.log('✅ Xendit invoice created:', invoice.id);

    res.json({
      id: invoice.id,
      external_id: invoice.external_id,
      invoice_url: invoice.invoice_url,
      status: invoice.status,
      amount: invoice.amount,
      expiry_date: invoice.expiry_date,
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

    // Try to find booking in all collections
    let booking = await Booking.findById(external_id);
    if (!booking) booking = await BookingPaket.findById(external_id);
    if (!booking) booking = await BookingRental.findById(external_id);
    if (!booking) booking = await BookingTourGuide.findById(external_id);

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

    const invoiceSpecificOptions = {};
    const i = new Invoice(invoiceSpecificOptions);

    const invoice = await i.getInvoice({ invoiceID: invoiceId });

    res.json({
      id: invoice.id,
      external_id: invoice.external_id,
      status: invoice.status,
      amount: invoice.amount,
    });
  } catch (error) {
    console.error('❌ Check payment status error:', error);
    res.status(500).json({ error: error.message });
  }
};
