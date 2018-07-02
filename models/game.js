'use strict';

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: {type: Number, required: true},
  name: {type: String, requireD: true},
  summary: String,
  first_release_date: {type: Number, required: true},
  platforms: [Number],
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