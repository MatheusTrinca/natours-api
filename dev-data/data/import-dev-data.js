const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('../../models/tourModel');

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

// LER O JSON
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));

// Importar Dados para o Tours Collection
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data sucessfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Deletar tudo do Tours Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data sucessfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
