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
      attributes: { exclude: ["updatedAt"] },
      include: [{ model: Users, attributes: ["nickname"] }],
    });
    res.send(boards);
  }),

  getListDetail: asyncHandler(async (req, res) => {
    const boardId = req.params.id;
    let board = await Boards.findByPk(boardId);

    if (board) {
      res.send(board);
    } else {
      res.status(404);
      throw new Error("해당 게시물이 없음");
    }
  }),

  deleteOneList: asyncHandler(async (req, res) => {
    const boardId = req.params.id;

    const boardByPk = await Boards.findByPk(boardId);
    if (!boardByPk) {
      res.status(404);
      throw new Error("해당 게시물이 없음");
    }

    const board = await Boards.findOne({
      where: {
        id: boardId,
        userId: req.tokenUser.id,
      },
    });
    if (!board) {
      res.status(401);
      throw new Error("해당 게시물의 작성자가 아님");
    } else {
      await Boards.destroy({
        where: {
          id: boardId,
          userId: req.tokenUser.id,
        },
      });
      res.send({ data: "OK" });
    }
  }),

  postLike: asyncHandler(async (req, res) => {
    res.send("5");
  }),
};
