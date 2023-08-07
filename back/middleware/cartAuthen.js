const jwt = require("jsonwebtoken");
const { User } = require("../model/userSchema");
const cartAuthen = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
  

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized." });
  }
};

module.exports = cartAuthen;
