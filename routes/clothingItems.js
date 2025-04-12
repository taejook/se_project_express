const router = require("express").Router();

const { createItem, getItems, likeItem, dislikeItem, deleteItem} = require("../controllers/clothingItems");

// Delete
router.delete('/:itemId', deleteItem)
// CREATE
router.post('/', createItem);
// READ
router.get('/', getItems)
// Like
router.put('/:itemId/likes', likeItem);
// Dislike
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;