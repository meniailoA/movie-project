const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });
const controller = require("../controller/movie.controller");

const repository = require("../services/movie/movie.repository.service");
//This route is for file which is already in project folder)
router.get("/load", controller.getWithIncludedFile);

router.post("/load-web", controller.getWithWebFile);

//Query => ?name
router.get("/get-movie", controller.getMovieInfoByName);

//Query => ?name
router.get("/get-movie-actor", controller.getMovieInfoByActorName);

router.get('/get-all-movies', controller.getMoviesInfo)

router.post("/", controller.createMovie);

router.delete("/", controller.deleteMovie);

// //Query => ?name
// router.get("/test", async (req, res, next) => {
//   const name = req.query.name;
//   const actor = await repository.findActorByName(name);
//   res.json(actor);
// });

module.exports = ["/movie", router];
