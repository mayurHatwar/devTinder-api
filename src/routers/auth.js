const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validate");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, age, gender, emailId, password } = req.body;
    validateSignupData(req.body);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
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
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

module.exports = authRouter;
