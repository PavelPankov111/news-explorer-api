const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const allRoutes = require('./routes/index');
require('dotenv').config();

const app = express();
app.use(cors());

const { PORT = 3000 } = process.env;
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { signin, signup } = require('./controllers/user');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/diplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signup);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);

app.use(auth);

app.use('/', allRoutes);

app.use(errors());
app.use(errorLogger);

app.all('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден'); });

app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Вы переедали неверные данные';
  }

  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Не найден';
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = 'Пользователь с таким email уже зарегестрирован';
  }
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT);
