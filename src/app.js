const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/user/:email", async (req, res) => {
  try {
    const userByEmail = await User.find({ email: req.params.email });
    if (userByEmail.length > 0) {
      res.status(200).send(userByEmail);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const isAllowUpdate = Object.keys(req.body).every((key) =>
      ["age", "gender", "mobileNumber"].includes(key),
    );

    if (!isAllowUpdate) {
      throw new Error("Invalid update fields");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find();
    if (allUsers.length > 0) {
      res.status(200).json(allUsers);
    } else {
      res.status(404).json({ error: "No users found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();

module.exports = app;
