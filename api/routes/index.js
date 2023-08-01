const express = require('express');
const passport = require('passport');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const { renderLogin, createDomain } = require('../controllers');
const router = express.Router();

router.get('/', renderLogin);
router.post('/domain', isLoggedIn, createDomain);

module.exports = router;