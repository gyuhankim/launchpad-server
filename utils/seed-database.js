'use strict';

const mongoose = require('mongoose');
const request = require('request');

const { DATABASE_URL } = require('../config');

const Game = require('../models/game');
const seedGames = require('../db/seed/games.json');


// =============== Can't figure out how to store the seedGames request JSON into MLab =============//
// // Test API call
// const options = {
//   url: 'https://api-endpoint.igdb.com/games/?fields=name,summary&filter[release_dates.date][gt]=1530547688359&limit=1',
//   method: 'GET',
//   headers: {
//     'Accept': 'application/json',
//     'Accept-Charset': 'utf-8',
//     'user-key': '5811dbfa8f2af4d23d9adcee288c794c'
//   }
// };

// const seedGames = request(options, function(err, res, body) {
//   return body;
// });

console.log(`Connecting to MongoDB/MLab at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('Dropping database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.log('Seeding database');
    console.log(JSON.stringify(seedGames));
    return Game.insertMany(seedGames);
  })
  .then(() => {
    console.log('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
