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

router.post('/', (req, res, next) => {
  
  const { gameId } = req.body; 
  const userId = req.user.id;

  User.findOneAndUpdate({ _id: userId }, { $addToSet: { games: gameId } }, { new: true })
    .then(result => {
      res.json(result).status(201);
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/', (req, res, next) => {

  const { gameId } = req.body;
  const userId = req.user.id;

  User.findOneAndUpdate({ _id: userId }, { $pull: { games: gameId} }, { new: true })
    .then(result => {
      res.json(result).status(204);
    })
    .catch(err => {
      next(err);
    });
    
});

module.exports = router;