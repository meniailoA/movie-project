const repository = require("./movie.repository.service");
const fs = require("fs");
const path = require("path");
const { dirname } = require("path");

const getMovieSchema = require("./responses/get-movie-info").schema;

class MovieService {
  // _fileReader() {
  //   const data = fs.readFileSync("movies.txt");
  //   const array = data.toString().split("\n");
  //   const arr = [];

  //   let count = 0;
  //   let response = [];

  //   for (let i in array) {
  //     if (array[i].split(":")[0] && array[i].split(":")[1]) {
  //       arr.push({
  //         [array[i].split(":")[0]]: array[i].split(":")[1],
  //       });
  //     }
  //   }

  //   for (let i = 0; i < arr.length; i += 4) {
  //     response[count] = Object.assign(
  //       {},
  //       arr[i],
  //       arr[i + 1],
  //       arr[i + 2],
  //       arr[i + 3]
  //     );
  //     count++;
  //   }

  //   return response;
  // }

  _fileReaderWeb(filename) {
    const data = fs.readFileSync(path.join(appRoot,  "public", "uploads", filename));
    const array = data.toString().split("\n");
    const arr = [];

    let count = 0;
    let response = [];

    for (let i in array) {
      if (array[i].split(":")[0] && array[i].split(":")[1]) {
        arr.push({
          [array[i].split(": ")[0]]: array[i].split(": ")[2]
            ? `${array[i].split(": ")[1]} ${array[i].split(": ")[2]}`
            : array[i].split(": ")[1],
        });
      }
    }

    for (let i = 0; i < arr.length; i += 4) {
      response[count] = Object.assign(
        {},
        arr[i],
        arr[i + 1],
        arr[i + 2],
        arr[i + 3]
      );
      count++;
    }
    return response;
  }

  async _syncWithDb() {
    return await repository._moveDataToTable(this._fileReader());
  }

  async _syncWithDbWeb(file) {
    const file_ = file.myFile;
    const filename = file_.name;

    const savePath = path.join(appRoot, "public", "uploads", filename);

    await file_.mv(savePath);

    return await repository._moveDataToTable(this._fileReaderWeb(filename));
  }

  async _findActorsToMovie(movie, isArr = true) {
    if (isArr) {
      const promise = movie.map(async (m) => {
        const moviesWithActors = await repository.findAllMovieToActorByMovieId(
          m.id
        );

        const actors = [];

        const promise = moviesWithActors.map(async (el) => {
          const actor = await repository.findActorById(el.ActorId);

          actors.push(`${actor.name}`);
        });

        await Promise.all(promise);

        return getMovieSchema(m, actors);
      });

      return await Promise.all(promise);
    }
    const moviesWithActors = await repository.findAllMovieToActorByMovieId(
      movie.id
    );

    const actors = [];

    const promise = moviesWithActors.map(async (el) => {
      const actor = await repository.findActorById(el.ActorId);

      actors.push(`${actor.name}`);
    });

    await Promise.all(promise);

    return getMovieSchema(movie, actors);
  }

  async getInfoAboutMovieByName(name) {
    const movie = await repository.findMovieByNameLike(name);

    if (!movie.length) return "There is no such movie in database";

    return await this._findActorsToMovie(movie);
  }

  async getInfoAboutAllMovies() {
    const movie = await repository.findAllMovies();

    return await this._findActorsToMovie(movie);
  }

  async createMovie(movieObj) {
    const checkMovie = await repository.findMovieByName(movieObj.name);

    if (checkMovie) return "There is movie with the same name";

    const movie = await repository.createMovie(
      movieObj.name,
      movieObj.date,
      movieObj.format
    );

    const promise = movieObj.actors.map(async (name) => {
      name = name.trim();

      const actor = await repository.findActorByName(name);

      if (!actor) {
        const actorNew = await repository.createActor(name);

        return await repository.createActorToMovie(actorNew.id, movie.id);
      } else {
        const checkExistActorInMovie = await repository.findActorExistInMoview(
          actor.id,
          movie.id
        );
        if (!checkExistActorInMovie) {
          await repository.createActorToMovie(actor.id, movie.id);
        }
      }
    });

    await Promise.all(promise);

    return "Successfully added";
  }

  async getMovieInfoByActorName(name) {
    let allActors = await repository.findAllActors();
    allActors = allActors.map((el) => el.name);

    const movie = await repository.findMovieByName(name);

    if (!allActors.includes(name) && !movie)
      return `There is no actor and movie with that name`;
    else if (!allActors.includes(name) && movie) {
      const moviesWithActors = await repository.findAllMovieToActorByMovieId(
        movie.id
      );

      const actors = [];

      const promise = moviesWithActors.map(async (el) => {
        const actor = await repository.findActorById(el.ActorId);

        actors.push(`${actor.name}`);
      });

      await Promise.all(promise);

      const movieResponse = await this._findActorsToMovie(movie, false);

      return `There is no actor with that name, but i found movie with the same name: 

      Title: ${movieResponse.Title}, 
      Release Year: ${movieResponse["Release Year"]},
      Format: ${movieResponse.Format},
      Stars: ${movieResponse.Start}

`;
    }

    return await this._findActorsToMovie(movie, false);
  }

  async deleteMovie(name) {
    return await repository.deleteMovie(name);
  }
}

module.exports = new MovieService();
