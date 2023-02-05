const movieService = require("../services/movie/movie.service");

class MovieController {
  async get(req, res, next) {
    try {
      const response = await movieService._syncWithDb();
      res.json({ message: "Successful" });
    } catch (err) {
      next(err);
    }
  }

  async getWithWebFile(req, res, next) {
    try {
      const file = req.files;
      const response = await movieService._syncWithDb(file);
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
}

module.exports = new MovieController();
