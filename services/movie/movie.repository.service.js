const MovieToActor = require("../../model/MovieToActor");
const Movie = require("../../model/Movie");
const Actor = require("../../model/Actor");

const { Sequelize, Op } = require("sequelize");

const FormatEnum = require("../../model/enum/format-movie.enum");

class MovieRepositoryService {
  async _moveDataToTable(movies) {
    const format = FormatEnum.getValues();

    const promise = movies.map(async (element) => {
      const movieExist = await this.findMovieByName(element.Title);

      if (!movieExist) {
        const formatMovie = format.includes(element.Format.trim())
          ? element.Format.trim()
          : FormatEnum.DVD;

        const movie = await this.createMovie(
          element.Title.trim(),
          element["Release Year"],
          formatMovie
        );

        let stars = element.Stars.trim();

        const startsPromise = stars.split(",").map(async (name) => {
          name = name.trim();

          const actor = await this.findActorByName(name);

          if (!actor) {
            const actorNew = await this.createActor(name);

            return await this.createActorToMovie(actorNew.id, movie.id);
          }

          const checkExistActorInMovie = await this.findActorExistInMoview(
            actor.id,
            movie.id
          );

          if (!checkExistActorInMovie) {
            return await this.createActorToMovie(actor.id, movie.id);
          }
        });

        await Promise.all(startsPromise);
      }
    });

    await Promise.all(promise);
  }

  async findMovieByName(name) {
    return await Movie.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        name.toLowerCase()
      ),
    });
  }

  async findMovieByNameLike(name) {
    return await Movie.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }

  async findActorByName(name) {
    return await Actor.findOne({
      where: {
        name,
      },
    });
  }

  async findAllActorByName(name) {
    return await Actor.findAll({
      where: {
        name,
      },
    });
  }
  

  async findAllMoviesToActor(ActorId) {
    return await MovieToActor.findAll({
      where: {
        ActorId,
      },
    });
  }

  async findAllActors() {
    return await Actor.findAll();
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

  async createActor(name) {
    return await Actor.create({
      name,
    });
  }

  async deleteMovie(name) {
    return await Movie.destroy({ where: { name } });
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

  async findMovieById(id) {
    return await Movie.findOne({ where: { id } });
  }

  async findActorById(id) {
    return await Actor.findOne({ where: { id } });
  }

  async findAllMovies(sort) {
    return await Movie.findAll({
      order: [["name", "ASC"]],
    });
  }
}

module.exports = new MovieRepositoryService();
