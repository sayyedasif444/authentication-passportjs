const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/User');
// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        '473220254096-0949ag038hetmkudmnto7frfl891cj4j.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
      clientSecret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
      callbackURL: 'http://localhost:3006/auth/user/google',
    },

    function (accessToken, refreshToken, profile, done) {
      // find a user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log('error in google strategy-passport', err);
          return;
        }
        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString('hex'),
              verified: true
            },
            function (err, user) {
              if (err) {
                console.log(
                  'error in creating user google strategy-passport',
                  err
                );
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
