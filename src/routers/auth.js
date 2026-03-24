const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const { validateSignupData } = require("../utils/validate");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, age, gender, email, mobileNumber, password } =
      req.body;
    validateSignupData(req.body);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      age,
      gender,
      email,
      mobileNumber,
      password: encryptedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const isMatch = await user.passwordMatches(password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const token = await user.getJwtToken();
    res.cookie("token", token);
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logout successful" });
});

module.exports = authRouter;
