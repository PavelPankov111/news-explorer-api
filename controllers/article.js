const article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

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
  // article.findByIdAndRemove({ _id: req.params.cardId })
  article.findById({ _id: req.params.cardId })
    .select('+owner')
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Артикль с таким id не найден');
      }
      const ownerStr = String(item.owner);
      const idStr = String(req.user._id);

      if (ownerStr !== idStr) {
        throw new ForbiddenError('Вы не можете удалять чужие артикли');
      }

      article.deleteOne(item)
        .then(() => res.send({ message: 'Артикль успешно удален' }));
    })
    .catch(next);
};
