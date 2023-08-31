const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const filterObject = require('../utils/filterObject');

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);

    if (populateOptions) query.populate(populateOptions);

    const doc = await query;

    if (!doc) return next(new AppError('No document found', 404));

    res.status(200).json({ status: 'success', data: doc });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndRemove(req.params.id);
    if (!doc)
      return next(new AppError(`No doc found with id ${req.params.id}`, 404));

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model, allowedParams) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      filterObject(req.body, ...allowedParams),
      {
        new: true,
        runValidators: true,
      },
    );

    if (!doc) return next(new AppError('No document found', 404));

    res.status(200).json({ status: 'success', data: doc });
  });

exports.createOne = (Model, allowedParams) =>
  catchAsync(async (req, res, next) => {
    const entity = filterObject(req.body, ...allowedParams);
    entity.author = req.user;

    const doc = await Model.create(entity);

    if (!doc) return next(new AppError('No document found', 404));

    res.status(201).json({ status: 'success', data: doc });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = req.filterOptions || {};
    const doc = await new APIFeatures(Model.find(filter), req.query)
      .find()
      .sort()
      .selectFields()
      .paginate().query;

    res.status(200).json({ status: 'success', results: doc.length, data: doc });
  });
