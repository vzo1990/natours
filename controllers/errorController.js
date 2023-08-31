const AppError = require('../utils/appError');

const sendErrorDev = (req, res, err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (req.originalUrl.startsWith('/api'))
    res.status(err.statusCode || 500).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  else
    res.status(err.statusCode || 500).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
};

const sendErrorProd = (req, res, err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational)
      res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message,
      });
    else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else
    res.status(err.statusCode || 500).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
};

const handleCastErrorDB = (err) =>
  new AppError(`Wrong value for ${err.path}`, 400);

const handleDuplicateFieldDB = (err) =>
  new AppError(
    `Duplicate field value  ${err.errmsg.match(/"(.*?[^\\])"/)[0]}`,
    400,
  );

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('You are not logged in', 401);

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') sendErrorDev(req, res, err);
  else {
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    )
      error = handleJsonWebTokenError(error);

    sendErrorProd(req, res, error);
  }

  next();
};
