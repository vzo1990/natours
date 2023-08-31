const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    maxlength: [1000, 'A review should not be longer then 1000 characters'],
    default: '',
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating should be between 1 and 5'],
    max: [5, 'Rating should be between 1 and 5'],
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',

    required: [true, 'Tour is required'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',

    required: [true, 'author is required'],
  },
});

// Prevent review creation for existing tour-user combination
reviewSchema.index({ tour: 1, author: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        ratingsNumber: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].ratingsNumber,
      ratingsAverage: stats[0].avgRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
};

reviewSchema.post('save', async function (doc) {
  await this.constructor.calcAverageRating(doc.tour);
});

reviewSchema.post(/^findOneAnd/, async (doc) => {
  await doc.constructor.calcAverageRating(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
