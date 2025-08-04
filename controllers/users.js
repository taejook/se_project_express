const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const { NotFoundError } = require("../utils/NotFoundError");
const { BadRequestError } = require("../utils/BadRequestError");
const { ConflictError } = require("../utils/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BadRequestError)
      .send({ message: "The password and email fields are required" });
  }
  return User.create({ name, avatar, email, password })
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(201).send({ data: userData });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(ConflictError)
          .send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError)
          .send({ message: "Please check email and password requirements." });
      } 
        return next(err);
      
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BadRequestError)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ message: "Authorized", token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password!") {
        return res
          .status(BadRequestError)
          .send({ message: "Information entered is invalid" });
      } 
        return next(err);
      
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "User not found" });
      }
      if (err.name === "BadRequestError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid User ID" });
      } 
        return next(err);
      
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid User ID" });
      } 
        return next(err);
      
    });
};

module.exports = { getCurrentUser, updateCurrentUser, createUser, login };
