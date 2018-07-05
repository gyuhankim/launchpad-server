'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const gamesRouter = require('./routes/games');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const favoritesRouter = require('./routes/favorites');

// Create an Express application
const app = express();

// ==== Middleware ==== //

// Create a static webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Log all requests. Skip logging in test env
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

// Configure Passport to utilize localStrategy and jwtStrategy
passport.use(localStrategy);
passport.use(jwtStrategy);

// Mount Routers
app.use('/', gamesRouter);
app.use('/register', usersRouter);
app.use('/favorites', favoritesRouter);
app.use('/login', authRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
