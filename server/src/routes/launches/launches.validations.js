const { body } = require('express-validator');

const launchesValidation = [
  body('mission').isString().notEmpty().withMessage('Mission is required'),
  body('rocket').isString().notEmpty().withMessage('Rocket is required'),
  body('target').isString().notEmpty().withMessage('Destination is required'),
  body('launchDate')
    .isString()
    .notEmpty()
    .withMessage('Launch-Date is required'),
];

module.exports = {
  launchesValidation,
};
