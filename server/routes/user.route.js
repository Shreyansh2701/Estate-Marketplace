const express = require('express');
const user = require('../controllers/user.controller')

const router = express.Router();

router.get('/', user);

module.exports = router;
