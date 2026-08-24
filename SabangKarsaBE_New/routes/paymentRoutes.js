const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

// @route   POST /payments/create-invoice
// @desc    Create Xendit payment invoice
// @access  Protected
router.post('/create-invoice', verifyToken, paymentController.createInvoice);

// @route   POST /payments/webhook
// @desc    Handle Xendit payment webhook
// @access  Public (but verified with callback token)
router.post('/webhook', paymentController.handleWebhook);

// @route   GET /payments/status/:invoiceId
// @desc    Check payment status
// @access  Protected
router.get('/status/:invoiceId', verifyToken, paymentController.checkPaymentStatus);

module.exports = router;
