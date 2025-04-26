const jwt = require("jsonwebtoken");

const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  module.exports = {
    token
  }