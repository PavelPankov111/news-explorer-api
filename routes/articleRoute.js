const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getArticles, postArticles, deleteArticles } = require('../controllers/article');

router.get('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
}), getArticles);

router.post('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }

      return helper.message('Поле link заполненно некорректно');
    }),
    image: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }

      return helper.message('Поле image заполненно некорректно');
    }),
    date: Joi.date(),
  }),
}), postArticles);

router.delete('/articles/:cardId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
}), deleteArticles);

module.exports = router;
