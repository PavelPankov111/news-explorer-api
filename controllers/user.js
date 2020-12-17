const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.signup = (req, res, next) => {
  const {
    password, email, name,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema.create({
        email,
        password: hash,
        name,
      })
        .then(() => {
          res.status(200).send({ message: 'Успешная регистрация' });
        })
        .catch(next);
    });
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Что то не так с почтой или паролем');
      }
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.myself = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send(user);
    })
    .catch(next);
};
