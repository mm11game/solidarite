const express = require("express");
const router = express.Router();
const { validForJoin } = require("../middlewares/validation");
const usersControllers = require("../controllers/usersControllers.js");

router.post("/join", validForJoin, usersControllers.join);
router.post("/login", usersControllers.login);

module.exports = router;
