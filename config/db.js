const mongoose = require('mongoose');
const debug = require('debug')('my-chat-app:DB');

// Get env variables
require('dotenv').config();

async function main() {
  const mongoDbURL = process.env.MONGODB_URL;

  if (!mongoDbURL) {
    debug('There is not env variable MONGODB_URL in .env file');
    process.exit(1); // Exit the process if no env variable
  }
  try {
    await mongoose.connect(mongoDbURL);
    debug('Successfully connected to the DB');
  } catch (error) {
    debug('Database connection failed', error);
    process.exit(1); // Exit node process
  }
}

main();
