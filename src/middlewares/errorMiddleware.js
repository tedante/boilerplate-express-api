const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
 
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);

  res.status(statusCode).json({
    success: false,
    message,
    error: err.errors || null
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  // res.status(404).json({
  //   success: false,
  //   message: "Not Found",
  //   error: null
  // });
};

module.exports = {
  errorHandler,
  notFound
};