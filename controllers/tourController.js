const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./public/img/tours/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (img, i) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(img.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./public/img/tours/${fileName}`);

      req.body.images.push(fileName);
    }),
  );

  next();
});

exports.topToursAlias = (req, res, next) => {
  req.query.price = { lt: '500' };
  req.query.sort = 'price';
  req.query.limit = '5';

  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour, [
  'name',
  'duration',
  'maxGroupSize',
  'difficulty',
  'ratingsAverage',
  'ratingsQuantity',
  'price',
  'priceDiscount',
  'summary',
  'description',
  'imageCover',
  'images',
  'startDates',
  'startLocation',
  'locations',
  'guides',
]);

exports.updateTour = factory.updateOne(Tour, [
  'name',
  'duration',
  'maxGroupSize',
  'difficulty',
  'ratingsAverage',
  'ratingsQuantity',
  'price',
  'priceDiscount',
  'summary',
  'description',
  'imageCover',
  'images',
  'startDates',
  'startLocation',
  'locations',
  'guides',
]);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        docs: { $sum: 1 },
        toursNum: { $sum: { $size: '$startDates' } },
        ratingsNum: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        minPrice: -1,
      },
    },
  ]);

  res
    .status(200)
    .json({ status: 'success', resultsNum: stats.length, data: { stats } });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, units } = req.params;

  const [lat, lng] = latlng.split(',');

  const radians = units === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radians] },
    },
  });

  res
    .status(200)
    .json({ status: 'success', resultsNum: tours.length, data: tours });
});
