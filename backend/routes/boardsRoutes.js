const express = require("express");
const router = express.Router();
const boardsControllers = require("../controllers/boardsControllers.js");
const { auth } = require("../middlewares/auth");

router.post("/", auth, boardsControllers.postList);
router.get("/", boardsControllers.getList);
router.get("/:id", boardsControllers.getListDetail);
router.delete("/:id", boardsControllers.deleteOneList);
router.post("/:id/like", boardsControllers.postLike);

module.exports = router;
