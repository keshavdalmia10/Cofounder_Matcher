const express = require("express");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/targets/:targetId/likes", auth, async (req, res) => {
  try {
    const targetId = req.params.targetId;
    const user = req.user;

    if (user._id === targetId) {
      return res.status(400).json({ error: "User cannot like himself." });
    }

    const target = await User.findById(targetId);

    if (!target) {
      return res.status(400).json({ error: "Person not exists." });
    }

    if (user.likes.includes(target._id)) {
      return res.status(400).json({ error: "Person already liked." });
    }

    if (target.likes.includes(user._id)) {
      const userSocket = req.connectedUsers[user];
      const targetSocket = req.connectedUsers[targetId];

      if (userSocket) {
        req.io.to(loggedSocket).emit("match", target);
      }

      if (targetSocket) {
        req.io.to(targetSocket).emit("match", user);
      }
    }

    user.likes.push(target._id);

    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.post("/targets/:targetId/dislikes", auth, async (req, res) => {
  try {
    const targetId = req.params.targetId;
    const user = req.user;

    if (user._id === targetId) {
      return res.status(400).json({ error: "User cannot dislike himself." });
    }

    const target = await User.findById(targetId);

    if (!target) {
      return res.status(400).json({ error: "Person not exists." });
    }

    if (user.dislikes.includes(target._id)) {
      return res.status(400).json({ error: "Person already disliked." });
    }

    user.dislikes.push(target._id);

    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = router;
