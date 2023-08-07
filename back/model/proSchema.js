const mongoose = require("mongoose");


const proSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: Buffer, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true },
    sellerId: { type: String, required: true },
    desc: { type: String, required: true },
  });
  
  const Pro = mongoose.model('PRODUCT', proSchema);
  
  module.exports = {Pro};