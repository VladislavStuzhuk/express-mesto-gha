const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err'); 
const CastError = require('../errors/cast-err');
const ValidationError = require('../errors/validation-err');
const RegisterError = require('../errors/register-err');

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};
module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Указан некорректный id'))
      } 
      next(err);
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => { 
      if (err.name === 'MongoServerError'){
        next(new RegisterError('Пользователь с данным e-mail уже зарегестрирован.'))
      } else if (err.name === 'ValidationError') {
        next(new ValidationError(err.message))
      } 
      next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  const {
    name, about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Указан некорректный id'))
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'))
      } 
      next(err);
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Указан некорректный id'))
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении аватара.'))
      } 
      next(err);
    });
};
