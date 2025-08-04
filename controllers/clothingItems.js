const ClothingItem = require("../models/clothingItem");
const { ForbiddenError } = require("../utils/ForbiddenError");
const { NotFoundError } = require("../utils/NotFoundError");
const { BadRequestError } = require("../utils/BadRequestError");
const { AuthorizationError } = require("../utils/AuthorizationError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "AuthorizationError") {
        return next(new AuthorizationError("Unauthorized"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "NotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "Item not found" });
      }
      if (err.name === "BadRequestError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid item ID" });
      } 
        return next(err);
      
    });
};

const likeItem = (req, res, next) => {
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
      if (err.name === "NotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "Item not found" });
      }
      if (err.name === "BadRequestError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid item ID" });
      } 
        return next(err);
      
    });
};

const dislikeItem = (req, res, next) => {
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
      if (err.name === "NotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "Item not found" });
      }
      if (err.name === "BadRequestError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid item ID" });
      } 
        return next(err);
      
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        return res
          .status(ForbiddenError)
          .send({ message: "You are not authorized to delete this item." });
      }

      return ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(() =>
          res.status(200).send({ message: "Item deleted successfully" })
        );
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "NotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "Item not found" });
      }
      if (err.name === "BadRequestError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid item ID" });
      } 
        return next(err);
      
    });
};

module.exports = {
  createItem,
  getItems,
  dislikeItem,
  likeItem,
  deleteItem,
};
