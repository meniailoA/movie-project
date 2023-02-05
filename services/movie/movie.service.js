const repository = require("./movie.repository.service");
const fs = require("fs");

const getMovieSchema = require("./responses/get-movie-info").schema;

class MovieService {
  _fileReader() {
    const data = fs.readFileSync("movies.txt");
    const array = data.toString().split("\n");
    const arr = [];

    let count = 0;
    let response = [];

    for (let i in array) {
      if (array[i].split(":")[0] && array[i].split(":")[1]) {
        arr.push({
          [array[i].split(":")[0]]: array[i].split(":")[1],
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

  _fileReaderWeb(file) {
    const array = file.toString().split("\n");
    const arr = [];

    let count = 0;
    let response = [];

    for (let i in array) {
      if (array[i].split(":")[0] && array[i].split(":")[1]) {
        arr.push({
          [array[i].split(":")[0]]: array[i].split(":")[1]
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
    return await repository._moveDataToTable(this._fileReaderWeb(file));
  }

  async getInfoAboutMovieByName(name) {
    const movie = await repository.findMovieByName(name);

    if (!movie) return "There is no such movie in database";

    const moviesWithActors = await repository.findAllMovieToActorByMovieId(
      movie.id
    );

    const actors = [];

    const promise = moviesWithActors.map(async (el) => {
      const actor = await repository.findActorById(el.ActorId);

      actors.push(`${actor.firstName} ${actor.lastName}`);
    });

    await Promise.all(promise);

    return getMovieSchema(movie, actors);
  }
}

module.exports = new MovieService();
