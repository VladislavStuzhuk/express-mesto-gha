const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  removeLike,
  setLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/),
  }),
}), createCard);
cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), removeLike);
cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), setLike);
module.exports = cardsRouter;
