const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    sellerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"seller",
        unique:true,
    },

    token:{type:String,required:true},
    createdAt: {type:Date, default:Date.now(),expires:3600} //1 hour

})

module.exports = mongoose.model("stoken",tokenSchema);