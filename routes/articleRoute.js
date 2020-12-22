const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
    link: Joi.string().required().pattern(/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
    image: Joi.string().required().pattern(/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
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
