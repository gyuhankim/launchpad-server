# LaunchPad.gg Server

## Table of Contents
- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Database](#database)
  - [Game Schema](#game-schema)
  - [User Schema](#user-schema)
- [Endpoints](#endpoints)
  - [Games](#games)
  - [Favorites](#favorites)
  - [Users](#users)

## Introduction
This is the server documentation for [LaunchPad.gg](https://mysterious-sands-19667.herokuapp.com/).

## Tech Stack
* Node
* Express
* MongoDB
* Mongoose
* Morgan
* Passport
* BCryptJS
* JSONWebToken
* dotEnv
* Axios
* cron
* Mocha
* Chai
* [IGDB API](https://igdb.github.io/api/)

## Database
LaunchPad.gg uses MongoDB / Mongoose for persistence of data. The "User" model stores references to ObjectIds from the "Games" collection as "Favorites".
The database uses the below schemas:

### Game Schema
```
id: {type: Number, required: true},
  name: {type: String, required: true},
  summary: String,
  first_release_date: Number,
  release_dates: [
    {
      platform: Number,
      category: Number,
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
}
```

### User Schema
```
firstName: {
    type: String, 
    required: true
  },
  lastName: {
    type: String, 
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
}
```

## Endpoints
All requests and responses are in JSON format.

### Games
Action | Path |
--- | --- |
GET (all) | https://launchpad-server.herokuapp.com/games |
GET (single) | https://launchpad-server.herokuapp.com/games/:id |

### Favorites
Action | Path |
--- | --- |
GET | https://launchpad-server.herokuapp.com/favorites |
POST | https://launchpad-server.herokuapp.com/favorites |
DELETE | https://launchpad-server.herokuapp.com/favorites |

### Users
Action | Path |
--- | --- |
POST (register) | https://launchpad-server.herokuapp.com/register |
POST (login) | https://launchpad-server.herokuapp.com/login |
POST (refresh JWT) | https://launchpad-server.herokuapp.com/login/refresh |