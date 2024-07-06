const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    notes: String,
  });
  
  const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
