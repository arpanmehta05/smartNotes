const express = require("express");
const router = express.Router();
const { signup, login, googleAuth, setPassword } = require("../controller/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/set-password", setPassword);

module.exports = router;
