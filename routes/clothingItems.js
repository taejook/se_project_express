const router = require("express").Router();
const auth = require('../middleware/auth');

const { createItem, getItems, likeItem, dislikeItem, deleteItem} = require("../controllers/clothingItems");


// READ
router.get('/', getItems)

router.use(auth);
// Delete
router.delete('/:itemId', deleteItem)
// CREATE
router.post('/', createItem);
// Like
router.put('/:itemId/likes', likeItem);
// Dislike
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;