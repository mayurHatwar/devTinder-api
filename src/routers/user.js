const express = require("express");
const userRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName gender profilePicture");
    res.json({
      message: "Connection requests received",
      data: connectionRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/user/connections", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUserId, status: "accepted" },
          { toUserId: loggedInUserId, status: "accepted" },
        ],
      })
      .populate(
        "fromUserId toUserId",
        "firstName lastName gender profilePicture",
      )
      .populate(
        "fromUserId toUserId",
        "firstName lastName gender profilePicture",
      );
    const data = connections.map((key) => {
      if (key.fromUserId._id.equals(loggedInUserId)) {
        return key.toUserId;
      }
      return key.fromUserId;
    });
    res.json({
      message: "Connected users",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
