const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const passport = require('passport');
const authController = require('../controllers/authController');

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
  res.render('welcome');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dash', {
    name: req.user.name,
  })
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/auth/user/google',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  authController.createSession
);

module.exports = router;
