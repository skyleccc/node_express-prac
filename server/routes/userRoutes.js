const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");

router.post("/register", user.registerController);
router.post("/login", user.loginController);

module.exports = router;