const express = require('express');
const validateData = require('../../../middlewares/validator');
const launchesRouter = express.Router();
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
} = require('./launches.controller');
const { launchesValidation } = require('./launches.validations');

launchesRouter.get('/', httpGetAllLaunches);

launchesRouter.post('/', launchesValidation, validateData, httpAddNewLaunch);

module.exports = launchesRouter;
