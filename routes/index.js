const router = require("express").Router();
const auth = require("../middleware/auth");
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { validateLogin, validateUserBody } = require("../middleware/validation");
const { NotFoundError } = require("../utils/NotFoundError");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.use("/items", clothingItems);

router.use("/users", auth, userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
