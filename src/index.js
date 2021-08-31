const express = require("express");

require("./db/mongoose");

const likeRoute = require("./routes/user.js");
const matchRoute = require("./routes/match.js");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(likeRoute);
app.use(matchRoute);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
