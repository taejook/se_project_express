const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/:userid", getUser);

module.exports = router;