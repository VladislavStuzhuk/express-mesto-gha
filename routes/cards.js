const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  removeLike,
  setLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.delete('/:cardId/likes', removeLike);
cardsRouter.put('/:cardId/likes', setLike);
module.exports = cardsRouter;
