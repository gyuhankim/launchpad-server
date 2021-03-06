'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

// Testing
router.get('/', (req, res, next) => {

  User.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });

});

// Get single user
router.get('/getone', (req, res, next) => {

  User.findOne()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Create new user
router.post('/', (req, res, next) => {

  let { firstName, lastName, username, password } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField} in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');

  if (nonStringField) {
    const err = new Error('Incorrect field type: expected string');
    err.status = 422;
    return next(err);
  }

  const explicitlyTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitlyTrimmedFields.find(field => req.body[field].replace(/ /g,'') !== req.body[field]);

  if (nonTrimmedField) {
    const err = new Error('Cannot have empty spaces');
    err.status = 422;
    return next(err);
  }

  const sizedFields = {
    username: {
      min: 8,
      max: 32
    },
    password: {
      min: 8,
      max: 32
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username: username.toLowerCase(),
        password: digest,
        firstName,
        lastName
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });

});

module.exports = router;