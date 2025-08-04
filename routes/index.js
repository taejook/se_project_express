const router = require("express").Router();
const auth = require("../middleware/auth");
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const {
  validateLogin
} = require("../middleware/validation");
const { NotFoundError } = require("../utils/NotFoundError");

router.post("/signin", validateLogin, login);
router.post("/signup", validateLogin, createUser);
router.use("/items", clothingItems);

router.use("/users", auth, userRouter);

router.use((req, res) => {
  res
    .status(NotFoundError)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
