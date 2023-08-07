const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passComplexity = require("joi-password-complexity");


const cartItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
});


const orderItemSchema = new mongoose.Schema({
  buyername: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: Number, required: true },
  sellerId: { type: String, required: true },
  productId: { type: String, required: true },
  name:{type: String, required: true},
  image: { type: String, required: true },
  price: { type: Number, required: true },
  status:{type: String}
});



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  verified:{
    type:Boolean,
    default:false
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
  orders: [orderItemSchema ], // Array of references to the Product model
  cart: [cartItemSchema], // Array of references to the Product model
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
  this.tokens = this.tokens.concat({token:token});
   await this.save();
 
  return token;
};


const User = mongoose.model("USER", userSchema);


module.exports = { User};
