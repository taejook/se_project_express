const router = require("express").Router();
const {
  validateUserBody,
} = require("../middleware/validation");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserBody, updateCurrentUser);

module.exports = router;