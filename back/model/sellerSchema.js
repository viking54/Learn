const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const sellerSchema = new mongoose.Schema({
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
  verified: {
    type: Boolean,
    default: false,
  },

  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

sellerSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
  this.tokens = this.tokens.concat({token:token});
   await this.save();
 
  return token;
};

const Seller = mongoose.model("SELLER", sellerSchema);

module.exports = { Seller };
