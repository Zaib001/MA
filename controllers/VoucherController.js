const Voucher = require('../models/Voucher');
const cron = require('node-cron');

// Create a new voucher
exports.createVoucher = async (req, res) => {
  const { code, discount, expirationDate } = req.body;

  try {
    const newVoucher = new Voucher({ code, discount, expirationDate });
    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all vouchers
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a voucher
exports.deleteVoucher = async (req, res) => {
  const { id } = req.params;

  try {
    const voucher = await Voucher.findByIdAndDelete(id);

    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found.' });
    }

    res.status(200).json({ message: 'Voucher deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.verifyVoucher = async (req, res) => {
    const { code } = req.body;
  
    try {
      const voucher = await Voucher.findOne({ code });
  
      if (!voucher) {
        return res.status(404).json({ error: 'Invalid promo code.' });
      }
  
      const now = new Date();
      if (voucher.expirationDate < now) {
        return res.status(400).json({ error: 'Promo code expired.' });
      }
  
      res.status(200).json({ discount: voucher.discount });
    } catch (error) {
      console.error('Error verifying voucher:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
// Cron job to expire vouchers automatically
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const expiredVouchers = await Voucher.deleteMany({
      expirationDate: { $lt: now },
    });

    console.log(`Expired ${expiredVouchers.deletedCount} vouchers.`);
  } catch (error) {
    console.error('Error expiring vouchers:', error);
  }
});
