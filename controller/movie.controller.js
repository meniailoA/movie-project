const movieService = require("../services/movie/movie.service");

class MovieController {
  async getWithIncludedFile(req, res, next) {
    try {
      const response = await movieService._syncWithDb();
      res.json({ message: "Successful" });
    } catch (err) {
      next(err);
    }
  }

  async getWithWebFile(req, res, next) {
    try {
      const file = req.files.file.data;
      const response = await movieService._syncWithDbWeb(file);
      res.json({ message: "Successful" });
    } catch (err) {
      next(err);
    }
  }

  async getMovieInfoByName(req, res, next) {
    try {
      const { name } = req.query;
      const response = await movieService.getInfoAboutMovieByName(name);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getMovieInfoByActorName(req, res, next) {
    try {
      const { name } = req.query;
      const response = await movieService.getMovieInfoByActorName(name);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getMoviesInfo(req, res, next) {
    try {
      const response = await movieService.getInfoAboutAllMovies();
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async createMovie(req, res, next) {
    try {
      const body = req.body;
      const response = await movieService.createMovie(body);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteMovie(req, res, next) {
    try {
      const { name } = req.query;
      const response = await movieService.deleteMovie(name);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MovieController();
