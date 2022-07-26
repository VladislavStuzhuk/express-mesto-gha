const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const AccesError = require('../errors/acces-err');
const ValidationError = require('../errors/validation-err');

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('')
    .then((card) => res.send(card))
    .catch((err) => next(err));
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        return Card.findByIdAndRemove(req.params.cardId)
          .then((i) => res.send({ data: i }));
      }
      throw new AccesError('Ошибка доступа');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Указан некорректный id карточки.'));
      } else next(err);
    });
};
module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Указан некорректный id карточки.'));
      } else next(err);
    });
};
module.exports.setLike = (req, res, next) => {
  console.log(req.user._id);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Указан некорректный id карточки.'));
      } else next(err);
    });
};
