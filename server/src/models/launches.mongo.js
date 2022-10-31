const mongoose = require('mongoose');

// The schema defines the structure of data in a document in our database (collection)
const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// Connects launchesSchema with the 'Launches' collection
// The Model takes a schema and applies/enforeces it to a particular collection in our Database, The Model also allows us to interact with our Database
module.exports = mongoose.model('Launch', launchesSchema);
