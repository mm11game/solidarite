const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../token/token");
const { Users } = require("../models");

module.exports = {
  auth: asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
      req.tokenUser = null;
      next();
      return; //여기서 리턴을 안 해주면, 밑에 있는걸 읽는다.
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
