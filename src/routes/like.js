const User = require("../models/Dev");

routes.post('/devs/:devId/likes',auth,async (req, res));
  {
    try {
     
      const { targetId } = req.params;
      const user = req.user

      if (user.id === devId) {
        return res.status(400).json({ error: "User cannot like himself." });
      }

      const user = await User.findById(user.id);
      const target = await User.findById(targetId);

      if (!target) {
        return res.status(400).json({ error: "Target not exists." });
      }

      if (user.likes.includes(target._id)) {
        return res.status(400).json({ error: "Target already liked." });
      }

      if (targetDev.likes.includes(user._id)) {
        const loggedSocket = req.connectedUsers[user];
        const targetSocket = req.connectedUsers[devId];

        if (loggedSocket) {
          req.io.to(loggedSocket).emit("match", targetDev);
        }

        if (targetSocket) {
          req.io.to(targetSocket).emit("match", loggedDev);
        }
      }

      loggedDev.likes.push(targetDev._id);

      await loggedDev.save();

      return res.json(loggedDev);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
