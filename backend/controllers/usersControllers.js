const { Users, Boards } = require("../models");
// const { generateToken } = require("../token/token");
const asyncHandler = require("express-async-handler");

module.exports = {
  join: asyncHandler(async (req, res) => {
    res.send("jkon");
  }),
  login: asyncHandler(async (req, res) => {
    res.send("login");
  }),
};
