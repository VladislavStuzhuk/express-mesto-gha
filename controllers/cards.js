const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('')
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        res.status(ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
};
module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        res.status(ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        res.status(ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
