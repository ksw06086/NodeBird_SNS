const express = require('express');
const passport = require('passport');
const { join, login, logout } = require('../controllers/auth');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const router = express.Router();

// post /auth/join
router.post('/join', isNotLoggedIn, join);
// post /auth/login
router.post('/login', isNotLoggedIn, login);
// get  /auth/logout
router.get('/logout', isLoggedIn, logout);


module.exports = router;