module.exports = (err, req, res) => {
  const { statusCode = 500, message = 'Произошла ошибка' } = err;
  res.status(statusCode).send({ message });
};
