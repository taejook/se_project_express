const router = require("express").Router();
const {
  validateUpdateUser
} = require("../middleware/validation");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateCurrentUser);

module.exports = router;