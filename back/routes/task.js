const express = require("express");
const { User} = require("../model/userSchema");
const bcrypt = require("bcrypt");
const Token = require("../model/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  try {
   
    if (!name || !email || !phone || !password || !cpassword) {
      return res.status(422).send({ message: "Enter Every Field" });
    }

    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).send({ message: "User Already Exist" });
    } else if (password != cpassword) {
      return res.status(422).send({ message: "Password Should Be Same" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    const hashCpassword = await bcrypt.hash(cpassword, salt);

    user = await new User({
      ...req.body,
      password: hashPassword,
      cpassword: hashCpassword,
    }).save();
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}task/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verfy Email", url);

    res.status(201).send({ message: "An Email is Sent Please Verify" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Invalid Link" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    await User.updateOne({ _id: user._id}, {verified: true });
    setTimeout(async () => {
      try {
       await Token.deleteOne({ userId: user._id, token: req.params.token });
      } catch (error) {
        console.log("Error removing token:", error);
      }
    }, 6000);
   


    return res.status(200).send({ message: "Email Verified" });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;
