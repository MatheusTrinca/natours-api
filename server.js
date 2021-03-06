const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(conn => console.log('DB connection success'));

//console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection! Shutting down...');
  console.log((err.name, err.message));
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED! Shutting down...');
  server.close(() => {
    console.log('Process terminated!');
  });
});
