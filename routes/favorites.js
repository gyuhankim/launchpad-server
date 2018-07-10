'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  User.findOne({ _id: userId })
    .populate('games')
    .then(user => {
      res.json(user.games);
    })
    .catch(err => {
      next(err);
    });
});

// Add a game to user's favorites list

// async fetch to get all the current ones
// async post to add a new one

router.post('/', (req, res, next) => {
  
  const gameId = req.body.gameId; // needs an action with fetch/post
  const userId = req.user.id;

  User.findOneAndUpdate({ _id: userId }, { $addToSet: { games: gameId } }, { new: true })
    .then(result => {
      res.json(result).status(201);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;