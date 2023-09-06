const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', multer().none(), authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.patch('/reset-password/:token', authController.resetPassword);
router.post('/forgot-password', authController.forgotPassword);
router.patch(
  '/update-password',
  authController.isAuthorized,
  authController.updatePassword,
);

router.patch(
  '/update-user',
  authController.isAuthorized,
  userController.setUserIdParam,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateUser,
);
router.delete(
  '/delete-user',
  authController.isAuthorized,
  userController.deleteUser,
);

router.route('/').get(userController.getAllUsers);
router
  .route('/me')
  .get(
    authController.isAuthorized,
    userController.setUserIdParam,
    userController.updateUser,
  );

router
  .route('/:id')
  .get(authController.isAuthorized, userController.getUser)
  .patch(
    authController.isAuthorized,
    authController.isAllowedTo('admin'),
    userController.updateUser,
  )
  .delete(
    authController.isAuthorized,
    authController.isAllowedTo('admin'),
    userController.deleteUserById,
  );

module.exports = router;
