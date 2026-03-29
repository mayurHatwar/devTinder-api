const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, "DEV@Tinder$790");
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Token is not valid" });
  }
};
module.exports = { authMiddleware };
