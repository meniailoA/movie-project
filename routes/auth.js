const express = require('express');
const router = express.Router();

const controller = require('../controller/auth.controller')

router.post('/login', controller.login)

//Need rework, but also,shows how it should work in theory)
router.post('/logout', controller.logout)

module.exports = ['/auth', router];