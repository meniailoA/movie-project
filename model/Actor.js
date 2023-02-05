const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Actor extends Model {}

Actor.init(
  {
    name: {
      type: DataTypes.STRING,
    }
  },
  { sequelize, modelName: "Actor", timestamps: false }
);

module.exports = Actor;
