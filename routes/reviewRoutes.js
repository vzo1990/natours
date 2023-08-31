const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    authController.isAuthorized,
    reviewController.setFilterOptions,
    reviewController.getAllReviews,
  )
  .post(
    authController.isAuthorized,
    authController.isAllowedTo('user'),
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(authController.isAuthorized, reviewController.getReview)
  .patch(
    authController.isAuthorized,
    reviewController.isReviewOwner,
    reviewController.updateReview,
  )
  .delete(
    authController.isAuthorized,
    authController.isAllowedTo('admin'),
    reviewController.deleteReview,
  );

module.exports = router;
