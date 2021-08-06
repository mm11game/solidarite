"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Boards extends Model {
    static associate(models) {
      // define association here
      Boards.belongsTo(models.Users, { foreignKey: "userId" });
    }
  }
  Boards.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      like: DataTypes.INTEGER,
      isLike: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Boards",
    }
  );
  return Boards;
};
