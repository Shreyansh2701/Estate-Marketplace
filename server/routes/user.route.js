const express = require('express');
const {user, updateUser} = require('../controllers/user.controller')
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.get('/', user);
router.post('/update/:id', verifyToken, updateUser);

module.exports = router;
