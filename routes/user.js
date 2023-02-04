const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controller/user.controller");

const auth = passport.authenticate("jwt", { session: false });

router.post("/", controller.create);
router.get("/", auth, controller.get);
router.delete("/:id", controller.delete);

module.exports = ["/user", router];
