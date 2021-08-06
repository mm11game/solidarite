module.exports = {
  notFound: (req, res, next) => {
    const error = new Error(`Not Found`);
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
