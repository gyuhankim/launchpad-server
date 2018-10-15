'use strict';

const mongoose = require('mongoose');
const axios = require('axios');
const CronJob = require('cron').CronJob;

const { DATABASE_URL } = require('../config');

const Game = require('../models/game');

const options = {
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'user-key': '5811dbfa8f2af4d23d9adcee288c794c'
  }
};

const getAllTheGames = new CronJob({
  cronTime: '* * * * * *',
  onTick: function() {
    console.log(`Connecting to MongoDB/MLab at ${DATABASE_URL}`);
    mongoose.connect(DATABASE_URL)
      .then(() => {
        return axios.get('https://api-endpoint.igdb.com/games/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAs81gWRVdqWW9YQnJUYVNBNDNYV0FWNlItUQ==/?fields=name,summary,release_dates,first_release_date,platforms,videos,screenshots,cover', options);
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
  },
  start: false,
  timeZone: 'America/New_York'
});

getAllTheGames.start();