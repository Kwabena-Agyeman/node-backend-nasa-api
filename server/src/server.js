const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8000;

const { loadPlanetsData } = require('./models/planets.model');

const server = http.createServer(app);

const startServer = async () => {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

// We separate out our server and express code so that we could extend the functionality of our server,
// Express is just a middleware built on top of the in-built node js Http package
// Building our server this way allows our server to work with express as well as other server side technologies like web-sockets
