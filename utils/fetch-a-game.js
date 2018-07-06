'use strict';

const mongoose = require('mongoose');
const axios = require('axios');

const { DATABASE_URL } = require('../config');

const Game = require('../models/game');

const gameId = 103369; // put the ID of the game you want to add, here

const options = {
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'user-key': '5811dbfa8f2af4d23d9adcee288c794c'
  },
  params: {
    fields: 'name,summary,release_dates,first_release_date,platforms,videos,screenshots,cover',
    'filter[first_release_date][gte]': '2018-01-01',
    limit: 50
  }
};

console.log(`Connecting to MongoDB/MLab at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL)
  .then(() => {
    return axios.get(`https://api-endpoint.igdb.com/games/${gameId}`, options);
  })
  .then(res => {
    console.log('Seeding database');
    console.log(res.data);
    return Game.insertMany(res.data);
  })
  .then(() => {
    console.log('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });