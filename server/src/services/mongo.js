const mongoose = require('mongoose');
const MONGO_URL =
  'mongodb+srv://nasa-api:m0v6mrsQus041u3r@cluster0.jvsor.mongodb.net/NASA-PROJECT?retryWrites=true&w=majority';

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

const MongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = {
  MongoConnect,
  MongoDisconnect,
};
