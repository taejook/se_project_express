const router = require("express").Router();
const auth = require('../middleware/auth');

const { createItem, getItems, likeItem, dislikeItem, deleteItem} = require("../controllers/clothingItems");
const {
    validateClothingItem,
    validateId,
} = require("../middleware/validation");


// READ
router.get('/', getItems)

router.use(auth);
// Delete
router.delete('/:itemId', validateClothingItem, deleteItem)
// CREATE
router.post('/', validateId, createItem);
// Like
router.put('/:itemId/likes', validateId, likeItem);
// Dislike
router.delete('/:itemId/likes',validateId, dislikeItem);

module.exports = router;