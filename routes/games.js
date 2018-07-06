'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Game = require('../models/game');

const router = express.Router();



router.get('/', (req, res, next) => {
  Game.find({
    first_release_date: {$gt: Date.now()}
  })
    .sort({first_release_date: 1})
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;