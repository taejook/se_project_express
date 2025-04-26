const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userid", getUser);
router.get("/",);
router.post("/", createUser);
router.post("/", createUser);

module.exports = router;