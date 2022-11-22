const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const api = require('./routes/api');

// Routes
const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

// CORS OPTIONS
const whiteList = ['http://localhost:3000', 'http://localhost:8000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Middlewares
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

// Serving our front end react app from the server.
// This build folder is only avaliable after running our deploy script in our root package.json
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

// Router
app.use('/v1', api);

// Serving our front end on the / path
app.get('/*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', 'client', 'build', 'index.html')
  );
});

module.exports = app;
