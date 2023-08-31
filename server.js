/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error(err);

  console.log('Shutting down the app...');

  process.exit(1);
});

dotenv.config({ path: './config.env' });

mongoose
  .connect(
    process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASSWORD),
  )
  .then(() => console.log('Successfully connected to DB'));

const app = require('./app');

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(err);

  console.log('Shutting down the app...');

  server.close(() => {
    process.exit(1);
  });
});
