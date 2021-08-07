const express = require("express");
const router = express.Router();
const boardsControllers = require("../controllers/boardsControllers.js");
const { auth } = require("../middlewares/auth");
const { validForBoard } = require("../middlewares/validation");

router.post("/", auth, validForBoard, boardsControllers.postList);
router.get("/", boardsControllers.getList);
router.get("/:id", auth, boardsControllers.getListDetail);
router.delete("/:id", auth, boardsControllers.deleteOneList);
router.post("/:id/like", auth, boardsControllers.postLike);

module.exports = router;
