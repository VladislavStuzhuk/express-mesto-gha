module.exports = (err, req, res, next) => {
  const { statusCode = 500, message = 'Произошла ошибка' } = err;
  res.status(statusCode).send({ message });
  next();
};
