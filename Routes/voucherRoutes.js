const express = require('express');
const {
  createVoucher,
  getVouchers,
  deleteVoucher,
  verifyVoucher
} = require('../controllers/VoucherController');

const router = express.Router();

router.post('/', createVoucher); // Create a new voucher
router.get('/', getVouchers); // Get all vouchers
router.delete('/:id', deleteVoucher); // Delete a voucher by ID
router.post('/verify', verifyVoucher);
module.exports = router;
