// This populates the process.emv object with the values in our .env file
// We call this file at the top because we want the env file to be populate before we call any other imports
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const server = http.createServer(app);

const { loadPlanetsData } = require('./models/planets.model');
const { loadSpaceXLaunchesData } = require('./models/launches.model');
const { MongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;
const startServer = async () => {
  await MongoConnect();
  await loadPlanetsData();
  await loadSpaceXLaunchesData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

// We separate out our server and express code so that we could extend the functionality of our server,
// Express is just a middleware built on top of the in-built node js Http package
// Building our server this way allows our server to work with express as well as other server side technologies like web-sockets
