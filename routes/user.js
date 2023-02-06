const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });
const controller = require("../controller/user.controller");

//create user(registration)
router.post("/", controller.create);

//get  all users
router.get("/", auth, controller.get);

//destroy user 
//Param(id)
router.delete("/:id", controller.delete);

module.exports = ["/user", router];
