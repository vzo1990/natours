const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    reqired: [true, 'A user name is required'],
    trim: true,
    maxlength: [100, 'A user name should not be longer then 100 characters'],
    minlength: [3, 'A user name should not be less then 3 characters'],
  },
  email: {
    type: String,
    reqired: [true, 'A user email is required'],
    unique: true,
    lowercase: true,
    maxlength: [100, 'A user email should not be longer then 100 characters'],
    minlength: [3, 'A user email should not be less then 10 characters'],
    validate: [validator.isEmail, 'Email format is invalid'],
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    reqired: [true, 'A user password is required'],
    maxlength: [
      100,
      'A user password should not be longer then 100 characters',
    ],
    minlength: [6, 'A user password should not be less then 6 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'Passwords are not the same',
    },
    select: false,
  },
  passwordUpdatedAt: {
    type: Date,
  },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  this.passwordUpdatedAt = Date.now();

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async function (password, hash) {
  return await bcrypt.compare(password, hash);
};

userSchema.methods.isPasswordUpdatedAfter = function (timestamp) {
  if (!this.passwordUpdatedAt) return false;
  return timestamp < parseInt(this.passwordUpdatedAt.getTime() / 1000, 10);
};

userSchema.methods.generateForgotPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordResetExpires =
    Date.now() + process.env.RESET_PASSWORD_TOKEN_EXPIRES * 1;

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
