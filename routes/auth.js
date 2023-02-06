const express = require('express');
const router = express.Router();
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });
const controller = require('../controller/auth.controller')

//login
router.post('/login', controller.login)

//need rework, but also,shows how it should work in theory)
router.post('/logout', auth, controller.logout)

module.exports = ['/auth', router];