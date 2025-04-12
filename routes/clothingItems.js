const router = require("express").Router();

const { createItem, getItems, likeItem, dislikeItem, updateItem, deleteItem} = require("../controllers/clothingItems");

//Update
router.put('/:itemId', updateItem)
//Delete
router.delete('/:itemId', deleteItem)
//CREATE
router.post('/', createItem);
//READ
router.get('/', getItems)
//Like
router.put('/:itemId/likes', likeItem);
//Dislike
router.put('/:itemId/likes', dislikeItem);

module.exports = router;