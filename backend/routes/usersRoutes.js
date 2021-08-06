const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers.js");

router.post("/join", usersControllers.join);
router.post("/login", usersControllers.login);

module.exports = router;
