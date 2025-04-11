const User = require("../models/user");
const {
    BAD_REQUEST_STATUS_CODE,
    CONFLICT_STATUS_CODE,
    UNAUTHORIZED_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
    FORBIDDEN_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
  } = require("../utils/errors");

//GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR_STATUS_CODE).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({ message: err.message });
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
        return res.status(NOT_FOUND_STATUS_CODE).send({message: err.message});
      } else if (err.name === "CastError"){
        return res.status(BAD_REQUEST_STATUS_CODE).send({message: err.message})
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({ message: err.message });
    });
};



module.exports = { getUsers, createUser, getUser };
