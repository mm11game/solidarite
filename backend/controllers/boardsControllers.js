const { Users, Boards } = require("../models");
// const { generateToken } = require("../token/token");
const asyncHandler = require("express-async-handler");

module.exports = {
  getList: asyncHandler(async (req, res) => {
    res.send("1");
  }),
  postList: asyncHandler(async (req, res) => {
    res.send("2");
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
