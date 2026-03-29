const express = require("express");
const userRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName gender photoUrl about skills",
      );
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
        "firstName lastName gender photoUrl about skills",
      )
      .populate(
        "fromUserId toUserId",
        "firstName lastName gender photoUrl about skills",
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

userRouter.get("/user/feed", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const loggedInUserId = req.user._id;
    const connections = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      })
      .select("fromUserId toUserId");
    const hideUserFromFeed = new Set();

    connections.forEach((key) => {
      hideUserFromFeed.add(key.fromUserId.toString());
      hideUserFromFeed.add(key.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select("firstName lastName gender photoUrl about skills")
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({
      message: "Users feed",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
