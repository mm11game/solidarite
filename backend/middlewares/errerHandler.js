module.exports = {
  wrongRoute: (req, res, next) => {
    const error = new Error(`잘못된 접근입니다`);
    res.status(404);
    next(error);
  },
  errorHandler: (err, req, res, next) => {
    const statusCode = res.statusCode;
    res.status(statusCode);
    res.send({
      statusCode,
      message: err.message,
    });
  },
};
