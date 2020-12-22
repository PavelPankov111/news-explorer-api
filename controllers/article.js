const article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');

module.exports.getArticles = (req, res, next) => article.find({ owner: req.user._id })
  .then((item) => {
    res.status(200).send(item);
  })
  .catch(next);

module.exports.postArticles = (req, res, next) => {
  const {
    keyword, title, text, source, link, image, date,
  } = req.body;
  return article.create({
    keyword, title, text, source, link, image, owner: req.user._id, date,
  })
    .then((item) => {
      const objItem = item.toObject();
      const { owner, ...newItem } = objItem;
      res.status(200).send(newItem);
    })
    .catch(next);
};

module.exports.deleteArticles = (req, res, next) => {
  article.findByIdAndRemove({ _id: req.params.cardId })
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch(next);
};
