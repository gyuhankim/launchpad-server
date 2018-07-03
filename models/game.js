'use strict';

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: {type: Number, required: true},
  name: {type: String, required: true},
  summary: String,
  first_release_date: Number,
  release_dates: [
    {
      platform: Number,
      category: Number, // release date format, refer to https://igdb.github.io/api/enum-fields/date-category/
      human: String
    }
  ],
  platforms: [Number],
  cover: Object,
  screenshots: [
    {
      url: String,
    }
  ],
  videos: [
    {
      name: String,
      video_id: String
    }
  ]
});

gameSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Game', gameSchema);