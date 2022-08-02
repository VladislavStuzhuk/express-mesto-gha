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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
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
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Указан некорректный id карточки.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Указан некорректный id карточки.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
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
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Указан некорректный id карточки.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
