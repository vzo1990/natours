const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setFilterOptions = (req, res, next) => {
  req.filterOptions = req.params.tourId ? { tour: req.params.tourId } : {};

  next();
};

exports.isReviewOwner = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (review.author.id !== req.user.id)
    return next(new AppError("You don't have permission", 403));

  next();
});

exports.createReview = factory.createOne(Review, ['review', 'rating', 'tour']);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review, ['review', 'rating']);
exports.deleteReview = factory.deleteOne(Review);
