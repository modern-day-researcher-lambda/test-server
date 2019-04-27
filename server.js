const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 4000;
const app = express();
const data = require("./data");
const token = "ahuBHejkJJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA07i73Gebhu98";

app.use(bodyParser.json());

app.use(cors());

function authenticator(req, res, next) {
  const { authorization } = req.headers;
  if (authorization === token) {
    next();
  } else {
    res.status(403).json({ error: "User be logged in to do that." });
  }
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "user" && password === "password") {
    req.loggedIn = true;
    res.status(200).json({
      payload: token
    });
  } else {
    res
      .status(403)
      .json({ error: "Username or Password incorrect. Please see Readme" });
  }
});

app.get("/cards", authenticator, (req, res) => {
  setTimeout(() => {
    res.send(data);
  }, 1000);
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
