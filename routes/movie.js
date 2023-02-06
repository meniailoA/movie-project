const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });
const controller = require("../controller/movie.controller");

const repository = require("../services/movie/movie.repository.service");

//This route is for file which is already in project folder)
// router.get("/load", controller.getWithIncludedFile);

//Routes for uploading file
router.get("/load-web", controller.uploadFileWeb);

router.post("/load-web", controller.getWithWebFile);

//Get movie by name
//Query => ?name
router.get("/get-movie", auth, controller.getMovieInfoByName);

//Get movie by actor name
//Query => ?name
router.get("/get-movie-actor", auth, controller.getMovieInfoByActorName);

//Get all movies
router.get("/get-all-movies", auth, controller.getMoviesInfo);

//Create movie
router.post("/", auth, controller.createMovie);

//Delete movie
router.delete("/", auth, controller.deleteMovie);

//Custom test
// //Query => ?name
// router.get("/test", async (req, res, next) => {
//   const name = req.query.name;
//   const actor = await repository.findActorByName(name);
//   res.json(actor);
// });

module.exports = ["/movie", router];
