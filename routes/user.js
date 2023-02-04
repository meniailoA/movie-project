const express = require('express');
const router = express.Router();

const controller = require('../controller/user.controller')

router.post('/', controller.create)
router.get('/', controller.get)
router.delete('/:id', controller.delete)

module.exports = ['/user', router];