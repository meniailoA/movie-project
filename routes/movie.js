const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });
const controller = require("../controller/movie.controller");

//This route is for file which is already in project folder)
router.get('/load', controller.get)

router.post('/load-web', controller.getWithWebFile)

router.get('/get-movie', controller.getMovieInfoByName)

module.exports = ["/movie", router];
