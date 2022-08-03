const User = require('../models/user');

const ERROR_CODE_VAL = 400;
const ERROR_CODE_CAST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEF = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(ERROR_CODE_DEF).send({ message: 'Произошла ошибка' });
    });
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_CAST).send({ message: 'Указан некорректный id.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.status(ERROR_CODE_DEF).send({ message: 'Произошла ошибка' });
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
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VAL)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(ERROR_CODE_DEF).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.updateUser = (req, res) => {
  const {
    name, about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_CAST).send({ message: 'Указан некорректный id.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VAL).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERROR_CODE_DEF).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_CAST).send({ message: 'Указан некорректный id.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VAL).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(ERROR_CODE_DEF).send({ message: 'Произошла ошибка' });
      }
    });
};
