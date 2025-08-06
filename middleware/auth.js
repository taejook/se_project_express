const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../utils/AuthorizationError");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthorizationError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new AuthorizationError("Authorization required"));
  }
};

module.exports = auth;
