const express = require("express");
const requestRouter = express.Router();

const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });

      const emailRes = await sendEmail.run(
        "A new friend request from " + req.user.firstName,
        req.user.firstName + " is " + status + " in " + toUser.firstName,
      );
      console.log(emailRes);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { requestId, status } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found!" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName +
          " has " +
          status +
          " the connection request from " +
          connectionRequest.fromUserId,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },
);

module.exports = requestRouter;
