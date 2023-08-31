const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

//router.param('id', tourController.checkTourId);
router
  .route('/top-5-tours')
  .get(tourController.topToursAlias, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.isAuthorized,
    authController.isAllowedTo('lead-guide', 'admin'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.isAuthorized,
    authController.isAllowedTo('lead-guide', 'admin'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.isAuthorized,
    authController.isAllowedTo('lead-guide', 'admin'),
    tourController.deleteTour,
  );

router
  .route('/tours-within/:distance/units/:units/from/:latlng')
  .get(tourController.getToursWithin);

module.exports = router;
