const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FormatMovieEnum = require("./enum/format-movie.enum");

class Movie extends Model {}

Movie.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    format: {
      type: DataTypes.ENUM(
        FormatMovieEnum.DVD,
        FormatMovieEnum.BLUE_RAY,
        FormatMovieEnum.VNS
      ),
      allowNull: true,
    },
  },
  { sequelize, modelName: "Movie", timestamps: false }
);

module.exports = Movie;
