const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String
}); 

module.exports = mongoose.model('Service', serviceSchema);
