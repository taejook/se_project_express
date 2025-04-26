const router = require("express").Router();
const { getCurrentUser, createUser, getUser } = require("../controllers/users");

router.get("/me", getCurrentUser);

module.exports = router;