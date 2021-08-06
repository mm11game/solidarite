const { Users } = require("../models");
const { generateToken } = require("../token/token");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const saltRound = 10;

module.exports = {
  join: asyncHandler(async (req, res) => {
    const { email, nickname, password } = req.body;

    const user = await Users.findOne({
      where: { email: email },
    });

    if (email.length === 0 || nickname.length === 0 || password.length === 0) {
      res.status(400);
      throw new Error("빈칸이 있음");
    }

    if (nickname.length > 10) {
      res.status(403);
      throw new Error("닉네임 길이가 김");
    }

    if (password.search(/\d/) == -1 || password.search(/[a-zA-Z]/) == -1) {
      res.status(403);
      throw new Error("비번에 문자나 숫자가 없음");
    }

    if (user) {
      res.status(403);
      throw new Error("이미 가입한 사람");
    } else {
      try {
        let salted = await bcrypt.genSalt(saltRound);
        let hashedPassword = await bcrypt.hash(password, salted);

        const createdUser = await Users.create({
          email,
          nickname,
          password: hashedPassword,
        });

        res.send({ data: "OK" });
      } catch (err) {
        throw err;
      }
    }
  }),
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({
      where: { email: email },
    });

    if (!user) {
      res.status(403);
      throw new Error("존재하지 않는 이메일");
    } else {
      try {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          let token = generateToken(user.id);
          res.send({ token, user });
        } else {
          res.status(403);
          throw new Error("비밀번호 틀림");
        }
      } catch (err) {
        throw err;
      }
    }
  }),
};
