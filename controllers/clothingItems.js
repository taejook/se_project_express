const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.user._id);

  const { name, weather, imageUrl, owner } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status("400").send({ message: err.message });
      }
      return res
        .status(500)
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
        return res.status(404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res
        .status(500)
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
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: err.message });
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
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: err.message });
    });
  }

const updateItem = (req, res) => {
  const { itemId } = req.param;
  const { imageUrl } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageUrl}})
  .orFail()
  .then((item) => res.status(200).send({ data: item}))
  .catch((err) => {
    console.log(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({ message: err.message });
    }
    if (err.name === "CastError") {
      return res.status(400).send({ message: err.message });
    }
    return res
      .status(500)
      .send({ message: err.message });
  });
}

const deleteItem = (req,res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204)
    .send({}))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: err.message });
    });
  }

module.exports = {
  createItem,
  getItems,
  dislikeItem,
  likeItem,
  updateItem,
  deleteItem
};
