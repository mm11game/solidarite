const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../token/token");

module.exports = {
  auth: asyncHandler(async (req, res) => {}),
};
