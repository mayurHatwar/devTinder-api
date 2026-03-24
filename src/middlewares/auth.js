const User = require("../model/user");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decoded = await jwt.verify(token, "Mayur@123");
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
module.exports = { authMiddleware };
