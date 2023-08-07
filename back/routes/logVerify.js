const express = require("express");
const { User } = require("../model/userSchema");
const bcrypt = require("bcrypt");
const router = express.Router();
const Token  = require("../model/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');



router.post("/", async (req, res) => {


try {
 
    const { email, password } = req.body;

    if(!email || !password)
    {
      return res.status(422).send({ message: "Enter Every Field" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email OR PASSWORD" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email OR PASSWORD" });
    }

    if(!user.verified)
    {
    let token = await Token.findOne({
        userId:user._id
       
      });
      if(!token)
      {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}task/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verfy Email", url);
      }
      return res.status(201).send({message:"Email sent To Your Account"})
    }
    
} catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
}


});


module.exports = router;
