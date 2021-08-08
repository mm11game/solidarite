"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Likes.belongsTo(models.Boards, { foreignKey: "boardId" });
      Likes.belongsTo(models.Users, { foreignKey: "userId" });
    }
  }
  Likes.init(
    {
      userId: DataTypes.INTEGER,
      boardId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Likes",
      timestamps: false,
    }
  );
  return Likes;
};
