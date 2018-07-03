'use strict';

const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');

const { DATABASE_URL } = require('../config');

const Game = require('../models/game');

const options = {
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'user-key': '5811dbfa8f2af4d23d9adcee288c794c'
  },
  params: {
    fields: 'name,summary,release_dates,first_release_date,platforms,videos,screenshots,cover',
    'filter[release_dates.date][gt]': '2018-01-01',
    limit: 50
  }
};

// request(options, function(err, res, body) {
//   seedGames = JSON.parse(res.body);
//   console.log(JSON.stringify(seedGames));
// });

console.log(`Connecting to MongoDB/MLab at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('Dropping database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    return axios.get('https://api-endpoint.igdb.com/games/', options);
  })
  .then(res => {
    console.log('Seeding database');
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