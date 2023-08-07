const express = require('express');
const {Seller} = require("../model/sellerSchema");
const bcrypt = require("bcrypt");
const router = express.Router();
const Token  = require("../model/stoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');



router.post("/" , async (req,res)=>{

 try {

    const{email,password} = req.body;
    if(!email || !password)
    {
        return res.send(422).send({message:"Enter Every Field"});

    }

    const seller = await Seller.findOne({email:email});
    if(!seller)
    {
        return res.status(401).send({message: "Invalid Email OR PASSWORD" });
    }
    
    const validPassword = await bcrypt.compare(password,seller.password);

    if(!validPassword)
    {
        return res.status(401).send({ message: "Invalid Email OR PASSWORD" });  
    }
 
    if(!seller.verified)
    {
        let token = await Token.findOne({
            sellerId:seller._id
           
          });
          if(!token)
          {
           token = await new Token({
              sellerId: seller._id,
              token: crypto.randomBytes(32).toString("hex"),
            }).save();
            const url = `${process.env.BASE_URL}sellertask/${seller._id}/sellerVerify/${token.token}`;
            await sendEmail(seller.email, "Verfy Email", url);
        
            
          }
          res.status(201).send({ message: "An Email is Sent Please Verify" });
    }

 } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
 }



});
module.exports = router;