const repository = require("./movie.repository.service");
const fs = require("fs");
const path = require("path");
const formatMovieEnum = require("../../model/enum/format-movie.enum");
const e = require("express");

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
    const data = fs.readFileSync(
      path.join(appRoot, "public", "uploads", filename)
    );
    const array = data.toString().split("\n");
    const arr = [];

    let count = 0;
    let response = [];

    for (let i in array) {
      if (array[i].split(": ")[0] && array[i].split(": ")[1]) {
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
        console.log(m);
        const moviesWithActors = await repository.findAllMovieToActorByMovieId(
          m.id
        );

        const actors = [];

        const promise = moviesWithActors.map(async (el) => {
          const actor = await repository.findActorById(el.ActorId);
          actors.push(`${actor.firstName} ${actor.lastName}`);
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

      actors.push(`${actor.firstName} ${actor.lastName}`);
    });

    await Promise.all(promise);

    return getMovieSchema(movie, actors);
  }

  async getInfoAboutMovieByName(name) {
    const movie = await repository.findMovieByNameLike(name);

    if (!movie.length) return "There is no such movie in database";

    return await this._findActorsToMovie(movie);
  }

  uaSort(s1, s2) {
    return s1.localeCompare(s2);
  }

  async getInfoAboutAllMovies() {
    const movie = await repository.findAllMovies();
    const localeCompare = (a, b) =>
      a.Title.toLowerCase().localeCompare(b.Title.toLowerCase(), "uk-UA");
    let movies = await this._findActorsToMovie(movie);
    return movies.sort(localeCompare);
  }

  // _testBody(movieObj) {
  //   if (!movieObj.name) {
  //     return "title is empty";
  //   } else if (
  //     !Number.isInteger(+movieObj.date) ||
  //     movieObj.date < 1800 ||
  //     movieObj.date > 2100
  //   ) {
  //     return "Date should be in rage of 1800 - 2100";
  //   } else if (!movieObj.format) {
  //     movieObj.format = formatMovieEnum.DVD;
  //   }
  // }

  contains(target, pattern) {
    let value = 0;
    pattern.forEach(function (word) {
      value = value + target.includes(word);
    });
    return value === 1;
  }

  async createMovie(movieObj) {
    const textName = movieObj.name.split("").filter((el) => el != " ");

    if (!movieObj.name || textName.length < 1) {
      return "title is empty";
    } else if (
      !Number.isInteger(+movieObj.date) ||
      movieObj.date < 1800 ||
      movieObj.date > 2100
    ) {
      return "Date should be in rage of 1800 - 2100";
    } else if (!movieObj.format) {
      movieObj.format = formatMovieEnum.DVD;
    }

    const checkMovie = await repository.findMovieByName(movieObj.name);
    const formats = formatMovieEnum.getValues();

    if (!formats.includes(movieObj.format))
      return "Format should be one of them DVD, Blu-Ray, VHS";

    if (checkMovie) return "There is movie with the same name";

    movieObj.actors = movieObj.actors.filter(
      (el, id) => movieObj.actors.indexOf(el) === id
    );

    const actrorsCheck = movieObj.actors.toString().split(",").join(" ");
    const bad = ["%", "?", "_", ";", "@", "*", "(", ")", "+", "#", "№"];
    const check = actrorsCheck.split(" ").filter((el) => el != "");

    if (this.contains(actrorsCheck, bad) || check.length < 1) {
      return "You can't use ?!@_;()#№ in actor's name or use space as a name";
    }

    const movie = await repository.createMovie(
      movieObj.name,
      new Date(movieObj.date),
      movieObj.format
    );

    const promise = movieObj.actors.map(async (name) => {
      name = name.trim().split(" ");
      let actor;
      if (name[1]) {
        actor = await repository.findActorByName(name[0], name[1]);
      } else {
        actor = await repository.findActorByNameF(name[0]);
      }

      if (!actor) {
        const actorNew = await repository.createActor(name[0], name[1]);

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

  async getMovieInfoByActorName(name, movie) {
    let actors;
    name = name.trim().split(" ");
    if (name[1]) {
      actors = await repository.findAllActorByName(name[0], name[1]);
    } else {
      actors = await repository.findAllActorByNameFirst(name[0]);
    }

    if (!actors.length) return "Actor with this name is not in the base";

    const promise = actors.map(async (actor) => {
      const allMovies = await repository.findAllMoviesToActor(actor.id);

      if (allMovies.length) {
        return await Promise.all(
          allMovies.map(async (movie) => {
            const movieObj = await repository.findMovieById(movie.MovieId);
            return await this._findActorsToMovie(movieObj, false);
          })
        );
      }
    });

    const response = await (await Promise.all(promise)).flat();

    if (movie) return response.filter((el) => el.Title === movie);

    return response;
  }

  async deleteMovie(name) {
    return await repository.deleteMovie(name);
  }
}

module.exports = new MovieService();
