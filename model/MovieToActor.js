const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Actor = require("./Actor");
const Movie = require("./Movie");

class MovieToActor extends Model {}

MovieToActor.init(
  {
    ActorId: {
      type: DataTypes.INTEGER,
    },
    MovieId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "MovieToActor",
    timestamps: false,
    onDelete: "CASCADE",
  }
);

Actor.belongsToMany(Movie, { through: "MovieToActor", onDelete: "CASCADE" });
Movie.belongsToMany(Actor, { through: "MovieToActor", onDelete: "CASCADE" });

module.exports = MovieToActor;
