const router = require("express").Router();

const { createItem } = require("../controllers/clothingItems");

//CRUD



//CREATE
router.post('/', createItem);

module.exports = router;