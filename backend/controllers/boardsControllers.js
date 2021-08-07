const { Users, Boards, Likes } = require("../models");
const { verifyToken } = require("../token/token");
const asyncHandler = require("express-async-handler");
const token = require("../token/token");
const likes = require("../models/likes");

module.exports = {
  postList: asyncHandler(async (req, res) => {
    if (!req.tokenUser) {
      res.status(404);
      throw new Error("인증정보가 없습니다");
    }
    const { title, content } = req.body;

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
    const boardId = req.params.id;
    const board = await Boards.findByPk(boardId);

    //애초에 게시물이 없을때
    if (!board) {
      res.status(404);
      throw new Error("해당 게시물이 없음");
    }

    //로그인 하지 않은 상태
    if (!req.tokenUser) {
      let isLike = false;
      res.send({ ...board.dataValues, isLike });
    } else {
      // 로그인을 한 상태
      let like = await Likes.findOne({
        where: {
          userId: req.tokenUser.id,
          boardId,
        },
      });
      // 좋아요 버튼을 눌렀었다면?
      if (like) {
        let isLike = true;
        res.send({ ...board.dataValues, isLike });
      } else {
        let isLike = false;
        res.send({ ...board.dataValues, isLike });
      }
    }
  }),

  deleteOneList: asyncHandler(async (req, res) => {
    if (!req.tokenUser) {
      res.status(401);
      throw new Error("인증정보가 없음");
    }

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
    if (!req.tokenUser) {
      res.status(401);
      throw new Error("인증정보가 없음");
    }

    const userId = req.tokenUser.id;
    const boardId = req.params.id;
    //로그인 된 상태다. 여기서 좋아요를 누르게 되면? likes에 값을 추가한다.
    const like = await Likes.findOne({
      where: {
        userId,
        boardId: boardId,
      },
    });

    if (like) {
      //이미 좋아요를 누른 상태
      let isLike = true;
      const board = await Boards.findByPk(boardId);
      res.send({ ...board.dataValues, isLike });
    } else {
      //좋아요를 안눌렀다면?
      let isLike = false;
      const createdLike = await Likes.create({
        userId,
        boardId,
      });
      isLike = true;
      const countLike = await Likes.count({
        where: {
          boardId,
        },
      });
      const updatedBoard = await Boards.update(
        { like: countLike },
        { where: { id: boardId } }
      );
      const board = await Boards.findByPk(boardId);
      res.send({ ...board.dataValues, isLike });
    }
  }),
};
