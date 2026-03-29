const express = require("express");
const profileRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth");

profileRouter.get("/profile/view", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

profileRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    const allowUpdate = [
      "age",
      "gender",
      "mobileNumber",
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
    ];

    const user = req.user;
    const isAllowUpdate = Object.keys(req.body).every((key) =>
      allowUpdate.includes(key),
    );

    if (!isAllowUpdate) {
      throw new Error("Invalid update fields");
    }

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = profileRouter;
