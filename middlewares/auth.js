const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization ) {
      next(new AuthError('Необходима авторизация'));
    }  
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'super-strong-secret');
    } catch (err) {
      next(new AuthError('Необходима авторизация'));
    }
    req.user = payload; 
    next();
  };