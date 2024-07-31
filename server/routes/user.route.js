const express = require('express');
const {user, updateUser, deleteUser} = require('../controllers/user.controller')
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.get('/', user);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

module.exports = router;
