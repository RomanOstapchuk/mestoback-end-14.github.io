const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, DATABASE_URL } = require('./config.js');

const usersrouter = require('./routes/user');

const cardsrouter = require('./routes/cards');


const app = express();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


app.use((req, res, next) => {
  req.user = {
    _id: '5eb683f8254a5b1b7da92ad8',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersrouter);
app.use('/cards', cardsrouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
