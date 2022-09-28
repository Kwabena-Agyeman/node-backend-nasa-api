const express = require('express');
const cors = require('cors');

// Routes
const planetsRouter = require('./routes/planets/planets.router');

const app = express();

// CORS OPTIONS
const whiteList = ['http://localhost:3000'];
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
app.use(express.json());

// Router
app.use(planetsRouter);

module.exports = app;
