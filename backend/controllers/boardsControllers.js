const { Users, Boards } = require("../models");
// const { generateToken } = require("../token/token");
const asyncHandler = require("express-async-handler");
const token = require("../token/token");

module.exports = {
  postList: asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (title.length === 0 || content.length === 0) {
      res.status(400);
      throw new Error("제목 또는 내용이 없음");
    }

    if (title.length > 30) {
      res.status(403);
      throw new Error("제목이 30자를 초과");
    }

    let createdBoard = await Boards.create({
      title,
      content,
      userId: req.tokenUser.id,
    });

    res.send({
      ...createdBoard.dataValues,
      user: { nickname: req.tokenUser.nickname },
    });
  }),

  getList: asyncHandler(async (req, res) => {
    let boards = await Boards.findAll({
      include: [{ model: Users, attributes: ["nickname"] }],
    });
    res.send(boards);
  }),
  getListDetail: asyncHandler(async (req, res) => {
    res.send("3");
  }),
  deleteOneList: asyncHandler(async (req, res) => {
    res.send("4");
  }),
  postLike: asyncHandler(async (req, res) => {
    res.send("5");
  }),
};
