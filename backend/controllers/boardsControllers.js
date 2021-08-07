const { Users, Boards, Likes } = require("../models");
const { verifyToken } = require("../token/token");
const asyncHandler = require("express-async-handler");
const token = require("../token/token");
const likes = require("../models/likes");

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
    const board = await Boards.findByPk(boardId);
    const token = req.headers.authorization;

    //로그인을 안 했을때
    if (!token) {
      let isLike = false;
      if (board) {
        res.send({ ...board.dataValues, isLike });
      } else {
        res.status(404);
        throw new Error("해당 게시물이 없음");
      }
    } else {
      //로그인을 했을때
      if (token.startsWith("Bearer")) {
        try {
          let decoded = verifyToken(token.split(" ")[1]);
          req.tokenUser = await Users.findOne({
            where: { id: decoded.data },
            attributes: { exclude: ["password"] },
          });
          //특정유저가 특정게시판에 좋아요를 눌렀는지 확인하고,
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
        } catch (err) {
          throw err;
        }
      }

      if (board) {
        res.send(board);
      } else {
        res.status(404);
        throw new Error("해당 게시물이 없음");
      }
    }
  }),

  deleteOneList: asyncHandler(async (req, res) => {
    const boardId = req.params.id;
    //게시물을 삭제할때 연쇄적으로 Likes에 들어가 있는 애들을 지워줘야한다.
    if (!req.tokenUser) {
      res.status(401);
      throw new Error("인증정보가 없음");
    }

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
    const userId = req.tokenUser.id;
    const boardId = req.params.id;
    console.log();

    //로그인 된 상태다. 여기서 좋아요를 누르게 되면? likes에 값을 추가한다.
    const like = await Likes.findOne({
      where: {
        userId,
        boardId: boardId,
      },
    });
    console.log("라이크", like);
    if (like) {
      //이미 좋아요를 누른 상태
      console.log(1);
      let isLike = true;
      const board = await Boards.findByPk(boardId);
      res.send({ ...board.dataValues, isLike });
    } else {
      //좋아요를 안눌렀다면?
      console.log(2);
      let isLike = true;
      const createdLike = await Likes.create({
        userId,
        boardId,
      });
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
