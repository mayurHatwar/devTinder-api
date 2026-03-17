const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./model/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, age, gender, email, mobileNumber } = req.body;
  try {
    const newUser = new User({
      firstName,
      lastName,
      age,
      gender,
      email,
      mobileNumber,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
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
