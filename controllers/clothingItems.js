const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .orFail()
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      res.status("500").send({ message: err.message });
    });
};

module.exports = {
  createItem,
};
