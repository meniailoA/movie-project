const express = require('express');
const router = express.Router();

const controller = require('../controller/auth.controller')

router.post('/', controller.login)

module.exports = ['/auth', router];