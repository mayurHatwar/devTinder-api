const express = require("express");
const requestRouter = express.Router();

requestRouter.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

requestRouter.get("/user/:email", async (req, res) => {
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

requestRouter.patch("/user/:userId", async (req, res) => {
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

requestRouter.get("/feed", async (req, res) => {
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

module.exports = requestRouter;
