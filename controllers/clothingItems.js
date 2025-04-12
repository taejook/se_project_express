const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
  .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
  .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

const deleteItem = (req,res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200)
    .send({data: item}))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  dislikeItem,
  likeItem,
  deleteItem
};
