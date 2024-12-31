const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  status: { type: String },
  serial:{type:String},
  active:{type:Boolean,default:true},
  image: { type: String },
  barcode: { type: String }, // Add barcode field

});

module.exports = mongoose.model('Product', ProductSchema);
