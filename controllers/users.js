const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.js');

const { ObjectId } = mongoose.Types;

module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.findUser = (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send({ message: 'Невалидный id' });
    return;
  }
  userModel.findById({ _id: id })
    .then((user) => (user ? res.status(200).send({ data: user }) : res.status(404).send({ message: 'Нет пользователя с таким id' })))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 8)
    .then((hash) => {
      userModel.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => userModel.findOne({ _id: user._id }))
        .then((user) => res.status(200).send({ user }))
        .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: 'Ошибка валидации' }) : res.status(500).send({ message: 'Произошла ошибка' })));
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'SOME-SECRET-KEY',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      }).end();
    })
    .catch((err) => {
      res.status(401).json({ message: err.message });
    });
};
