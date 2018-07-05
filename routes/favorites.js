'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Game = require('../models/game');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));

router.get('/', (req, res, next) => {
  res.json({favorites: 'this is a protected endpoint'});
});

module.exports = router;