const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .populate('')
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        res.status(ERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.updateUser = (req, res) => {
  const {
    name, about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      const ERROR_CODE2 = 404;
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE2)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      const ERROR_CODE2 = 404;
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE2)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
