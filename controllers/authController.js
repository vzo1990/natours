const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const generateJWT = (data) =>
  jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

const verifyJWT = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) throw new AppError(err, 400);
    return data;
  });

const sendToken = (user, statusCode, res) => {
  const token = generateJWT({ id: user._id });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/account`;

  await new Email(user, url).sendWelcome();

  sendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  sendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.isAuthorized = catchAsync(async (req, res, next) => {
  // Verify token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) return next(new AppError('You are not logged in', 401));

  const { id, iat } = verifyJWT(token);

  // verify user
  const user = await User.findById(id);

  if (!user) return next(new AppError('You are not logged in', 401));

  //  verify password didn't changed since token was generated
  if (user.isPasswordUpdatedAfter(iat))
    return next(new AppError('You are not logged in', 401));

  req.user = user;

  next();
});

// Checks if user is logged in for front end only
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // Verify token
  const token = req.cookies.jwt;

  if (!token || token === 'loggedout') return next();

  const { id, iat } = verifyJWT(token);

  // verify user
  const user = await User.findById(id);

  if (!user) return next();

  //  verify password didn't changed since token was generated
  if (user.isPasswordUpdatedAfter(iat)) return next();

  // put user into locals variable which is accessible in pug templates
  res.locals.user = user;

  next();
});

exports.isAllowedTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You have no permissions', 403));

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new AppError('Please provide email', 400));

  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const token = user.generateForgotPasswordToken();

    const url = `${req.protocol}://${req.host}/api/v1/users/reset-password/${token}`;

    await new Email(user, url).sendResetPassword();

    await user.save();
  }

  res.status(200).json({
    status: 'success',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.params.token)
    return next(new AppError('Wrong or expired token', 400));

  const encodedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: encodedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Wrong or expired token', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: 'success',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.checkPassword(req.body.currentPassword, user.password)))
    return next(new AppError('Please enter correct current password', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  sendToken(user, 200, res);
});
