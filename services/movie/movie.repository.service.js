const MovieToActor = require("../../model/MovieToActor");
const Movie = require("../../model/Movie");
const Actor = require("../../model/Actor");

const { Sequelize, Op } = require("sequelize");

const FormatEnum = require("../../model/enum/format-movie.enum");

class MovieRepositoryService {
  async _moveDataToTable(movies) {
    const format = FormatEnum.getValues();

    movies.map(async (element) => {
      console.log(element);
      const movieExist = await this.findMovieByName(element.Title.trim());

      if (!movieExist) {
        const formatMovie = format.includes(element.Format.trim())
          ? element.Format.trim()
          : FormatEnum.DVD;

        const movie = await this.createMovie(
          element.Title.trim(),
          element["Release Year"],
          formatMovie
        );

        element.Stars.trim()
          .split(",")
          .map(async (el) => {
            const firstName = el.trim().split(" ")[0];
            const lastName = el.trim().split(" ")[1];

            const actor = await this.findActorByName(firstName, lastName);

            if (!actor) {
              const actorNew = await this.createActor(firstName, lastName);

              await this.createActorToMovie(actorNew.id, movie.id);
            } else {
              const checkExistActorInMovie = await this.findActorExistInMoview(
                actor.id,
                movie.id
              );
              if (!checkExistActorInMovie) {
                await this.createActorToMovie(actor.id, movie.id);
              }
            }
          });
      }
    });
  }

  async findMovieByName(name) {
    return await Movie.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        name.toLowerCase()
      ),
    });
  }

  async findActorByName(firstName, lastName) {
    return await Actor.findOne({
      where: {
        firstName,
        lastName,
      },
    });
  }

  async findActorById(id) {
    return await Actor.findOne({
      where: {
        id,
      },
    });
  }

  async findActorExistInMoview(ActorId, MovieId) {
    return await MovieToActor.findOne({ where: { ActorId, MovieId } });
  }

  async createActorToMovie(ActorId, MovieId) {
    return await MovieToActor.create({ ActorId, MovieId });
  }

  async createActor(firstName, lastName) {
    return await Actor.create({ firstName, lastName });
  }

  async createMovie(name, date, format) {
    return await Movie.create({
      name,
      date,
      format,
    });
  }

  async findAllMovieToActorByMovieId(MovieId) {
    return await MovieToActor.findAll({ where: { MovieId } });
  }
}

module.exports = new MovieRepositoryService();
