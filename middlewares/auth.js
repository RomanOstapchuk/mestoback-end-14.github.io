/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'SOME-SECRET-KEY');
  } catch (err) {
    res.status(401).send({ message: err.message });
  }


  req.user = payload;
  next();
};
