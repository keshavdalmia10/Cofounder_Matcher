const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/cofounder.model");

router.put("/match/:id", auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      return res.status(404).send("Target does not exists");
    }

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);

      req.user.liked_posts.push(post._id);
      console.log(req.user.liked_posts);
      console.log(post.likes);

      res.send("Post liked");
    } else {
      let index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      console.log(post.likes);
      index = req.user.liked_posts.indexOf(post._id);
      req.user.liked_posts.splice(index, 1);
      console.log(req.user.liked_posts);

      res.send("Post unliked");
    }

    await post.save();
    await req.user.save();
  } catch (e) {
    res.status(500).json(e);
  }
});
