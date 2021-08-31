const express = require("express");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

const router = new express.Router();

//signup
router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

//logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//get details of the user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/feed", auth, async (req, res) => {
  try {
    const user = req.user;

    const targets = await User.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: user.likes } },
        { _id: { $nin: user.dislikes } },
      ],
    });

    return res.json(targets);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = router;
