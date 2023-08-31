const slugify = require('slugify');
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [100, 'A tour name should not be longer then 100 characters'],
      minlength: [10, 'A tour name should not be less then 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
      min: [1, 'A tour duration should not be less then 1'],
      max: [100, 'A tour duration should not be more then 100'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
      min: [1, 'A tour group should not be less then 1'],
      max: [25, 'A tour group should not be more then 25'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: `Difficulty should be one of 'easy', 'medium', 'difficult' `,
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour rating should not be less then 1'],
      max: [5, 'A tour rating should not be more then 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [1, 'A tour price should not be less then 1'],
      max: [10000, 'A tour price should not be more then 10000'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val <= this.price;
        },
        message: 'Discount should be less then price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, ' A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    slug: {
      type: String,
      default: function () {
        return slugify(this.name, { lower: true });
      },
    },
    startLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',

      required: [true, 'author is required'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

tourSchema.pre(/^find/, function (next) {
  this.populate('guides');
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
