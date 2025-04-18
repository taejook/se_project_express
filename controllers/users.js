const User = require("../models/user");
const {
    BAD_REQUEST_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
  } = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR_STATUS_CODE).send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid User ID" });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({ message: "An error occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userid } = req.params;
  User.findById(userid)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid User ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
  };


module.exports = { getUsers, createUser, getUser };
