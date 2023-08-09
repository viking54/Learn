const express = require("express");
const { Seller } = require("../model/sellerSchema");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const authen = require('../middleware/Authen')
const userAuthen = require('../middleware/userAuthen')
const router = express.Router();
router.use(cookieParser());

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(422).send({ message: "Enter Every Field" });
    }

    const seller = await Seller.findOne({ email: email });
    if (!seller) {
      return res.status(401).send({ message: "Invalid Email OR PASSWORD" });
    }

    const validPassword = await bcrypt.compare(password, seller.password);

    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email OR PASSWORD" });
    }

    if (!seller.verified) {
      return res
        .status(401)
        .send({ message: "Seller Not Verified Fill and Click on Verify" });
    }

    if (validPassword) {
      const token = await seller.generateAuthToken();
      console.log(token);
      res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 25892000000),
        sameSite: "none",
        secure: true 
  
      });
      return res.status(200).send({ message: "Logged in" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/authSeller", authen, async (req, res) => {
    res.send(req.rootSeller);
  });

  
  router.get("/authUser",userAuthen, async (req, res) => {
    
    res.send(req.rootUser);
  });

  


module.exports = router;
