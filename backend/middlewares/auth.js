const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../token/token");
const { Users } = require("../models");

module.exports = {
  auth: asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
      res.status(401);
      throw new Error("인증정보가 없음");
    }

    if (token.startsWith("Bearer")) {
      try {
        let decoded = verifyToken(token.split(" ")[1]);
        req.tokenUser = await Users.findOne({
          where: { id: decoded.data },
          attributes: { exclude: ["password"] },
        });
        next();
      } catch (err) {
        throw err;
      }
    }
  }),
};
