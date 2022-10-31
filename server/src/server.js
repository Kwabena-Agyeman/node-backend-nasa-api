const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 8000;
const MONGO_URL =
  'mongodb+srv://nasa-api:m0v6mrsQus041u3r@cluster0.jvsor.mongodb.net/NASA-PROJECT?retryWrites=true&w=majority';

const { loadPlanetsData } = require('./models/planets.model');

const MongoConnect = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected!!');
  } catch (error) {
    console.log('Failed to connect to MongoDB', error);
  }
};

const server = http.createServer(app);

const startServer = async () => {
  await MongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

// We separate out our server and express code so that we could extend the functionality of our server,
// Express is just a middleware built on top of the in-built node js Http package
// Building our server this way allows our server to work with express as well as other server side technologies like web-sockets
