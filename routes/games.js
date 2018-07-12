'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Game = require('../models/game');
const User = require('../models/user');

const router = express.Router();

// Get initial 50 games
router.get('/', (req, res, next) => {
  const page = req.headers.pagenum;

  Game.find({
    first_release_date: {$gt: Date.now()}
  })
    .sort({first_release_date: 1})
    .skip(36 * (page - 1))
    .limit(36)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const gameId = req.params.id;

  Game.findOne({id: gameId})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;