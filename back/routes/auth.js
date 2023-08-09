const express = require("express");
const { User } = require("../model/userSchema");
const { Pro } = require("../model/proSchema");
const bcrypt = require("bcrypt");
const cartAuthen = require("../middleware/cartAuthen");
const { Console } = require("console");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).send({ message: "Enter Every Field" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email OR PASSWORD" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email OR PASSWORD" });
    }

    if (!user.verified) {
      return res
        .status(401)
        .send({ message: "User Not Verified Fill and Click on Verify" });
    }

    if (validPassword) {
      const token = await user.generateAuthToken();
      console.log(token);
      res.cookie("jwtUtoken", token, {
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

router.post("/cart", cartAuthen, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!req.body.productId) {
      return res.status(400).send({ error: "Product ID is required." });
    }

    const product = await Pro.findById(req.body.productId);

    if (!product) {
      return res.status(404).send({ error: "Product not found." });
    }

    user.cart.push(product);
    await user.save();

    res.status(200).send({ message: "Product added to cart successfully." });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).send({ error: "Server error." });
  }
});


router.get("/logout" , (req,res)=>{
    
  res.clearCookie("jwttoken");
     
  res.clearCookie("jwtUtoken");
  res.status(200).send("Logout Done")

  

})



module.exports = router;
