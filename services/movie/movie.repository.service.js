const MovieToActor = require("../../model/MovieToActor");
const Movie = require("../../model/Movie");
const Actor = require("../../model/Actor");
const { Sequelize, Op } = require("sequelize");
const FormatEnum = require("../../model/enum/format-movie.enum");

class MovieRepositoryService {
  contains(target, pattern) {
    let value = 0;
    pattern.forEach(function (word) {
      value = value + target.includes(word);
    });
    return value === 1;
  }

  async _moveDataToTable(movies) {
    const format = FormatEnum.getValues();

    const promise = movies.map(async (element) => {
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

        let stars = element.Stars.trim();

        const startsPromise = stars.split(", ").map(async (name) => {
          name = name.trim().split(" ");
       
          const actor = await this.findActorByName(name[0].trim(), name[1].trim());

          if (!actor) {
            const actorNew = await this.createActor(name[0].trim(), name[1].trim());

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

        return await Promise.all(startsPromise);
      }
    });

    return await Promise.all(promise);
  }

  async findMovieByName(name) {
    return await Movie.findOne({
      where: { name },
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

  async findActorByName(firstName, lastName) {
    return await Actor.findOne({
      where: {
        firstName,
        lastName,
      },
    });
  }

  async findActorByNameF(firstName) {
    return await Actor.findOne({
      where: {
        firstName,
      },
    });
  }

  async findAllActorByName(firstName, lastName) {
    return await Actor.findAll({
      where: {
        firstName,
        lastName,
      },
    });
  }
  
  async findAllActorByNameFirst(firstName) {
    return await Actor.findAll({
      where: {
        firstName
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

  async createActor(firstName, lastName) {
    return await Actor.create({
      firstName,
      lastName
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
